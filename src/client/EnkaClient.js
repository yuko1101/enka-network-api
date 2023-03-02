const User = require("../models/User");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { bindOptions } = require("../utils/options_utils");
const characterUtils = require("../utils/character_utils");
const CachedAssetsManager = require("./CachedAssetsManager");
const CharacterData = require("../models/character/CharacterData");
const WeaponData = require("../models/weapon/WeaponData");
const Costume = require("../models/character/Costume");
const { fetchJSON } = require("../utils/axios_utils");
const NameCard = require("../models/NameCard");
// eslint-disable-next-line no-unused-vars
const { LanguageCode } = require("./CachedAssetsManager");
const EnkaNetworkError = require("../errors/EnkaNetworkError");
const ArtifactData = require("../models/artifact/ArtifactData");
const { artifactRarityRangeMap } = require("../utils/constants");
const { separateWithValue } = require("../utils/object_utils");
const DetailedUser = require("../models/DetailedUser");
const EnkaUser = require("../models/enka/EnkaUser");
const EnkaProfile = require("../models/enka/EnkaProfile");
const CharacterBuild = require("../models/enka/CharacterBuild");

const getUserUrl = (enkaUrl, uid) => `${enkaUrl}/api/uid/${uid}`;
const getEnkaProfileUrl = (enkaUrl, username) => `${enkaUrl}/api/profile/${username}`;

/**
 * @en EnkaClientOptions
 * @typedef EnkaClientOptions
 * @type {object}
 * @property {string} [enkaUrl="https://enka.network"]
 * @property {string} [userAgent="Mozilla/5.0"]
 * @property {bigint} [timeout=3000] http request timeout in milliseconds
 * @property {LanguageCode} [defaultLanguage="en"]
 * @property {string} [cacheDirectory]
 * @property {boolean} [showFetchCacheLog=true]
 */

/**
 * @en EnkaClient
 */
class EnkaClient {

    /**
     * @param {EnkaClientOptions} [options]
     */
    constructor(options = {}) {
        /** @type {EnkaClientOptions} */
        this.options = bindOptions({
            "enkaUrl": "https://enka.network",
            "userAgent": "Mozilla/5.0",
            "timeout": 3000,
            "defaultLanguage": "en",
            "cacheDirectory": null,
            "showFetchCacheLog": true,
        }, options);

        /** @type {CachedAssetsManager} */
        this.cachedAssetsManager = new CachedAssetsManager(this);
    }

    /**
     * @param {number | string} uid
     * @param {boolean} collapse Whether to fetch rough user information (Very fast)
     * @param {boolean} parse
     * @returns {Promise<User | DetailedUser>}
     */
    async fetchUser(uid, collapse = false) {
        if (typeof uid !== "number" && typeof uid !== "string") throw new Error("Parameter `uid` must be a number or a string.");

        const url = getUserUrl(this.options.enkaUrl, uid) + (collapse ? "?info" : "");

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 424:
                    throw new EnkaNetworkError("Request to enka.network failed because it is under maintenance.");
                case 429:
                    throw new EnkaNetworkError("Rate Limit reached. You reached enka.network's rate limit. Please try again in a few minutes.");
                case 404:
                    throw new UserNotFoundError(`User with uid ${uid} was not found. Please check whether the uid is correct. If you find the uid is correct, it may be a internal server error.`);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`);
            }
        }
        const data = response.data;

        return collapse ? new User(data, this, uid) : new DetailedUser(data, this, uid);
    }

    /**
     * @param {string} username enka.network username, not in-game nickname
     * @returns {Promise<EnkaProfile>}
     */
    async fetchEnkaProfile(username) {
        const url = getEnkaProfileUrl(this.options.enkaUrl, username);

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`);
            }
        }
        const data = response.data;

        return new EnkaProfile(data, this);
    }

    /**
     * @param {string} username enka.network username, not in-game nickname
     * @returns {Promise<Array<EnkaUser>>}
     */
    async fetchAllEnkaUsers(username) {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl, username)}/hoyos`;

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`);
            }
        }
        const data = response.data;

        return Object.values(data).map(u => new EnkaUser(u, this, username));
    }

    /**
     * @param {string} username enka.network username, not in-game nickname
     * @param {string} hash EnkaUser hash
     * @returns {Promise<Object.<string, Array<CharacterBuild>>>}
     */
    async fetchEnkaUserBuilds(username, hash) {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl, username)}/hoyos/${hash}/builds`;

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`);
            }
        }
        const data = response.data;

        const builds = {};
        for (const characterId in data) {
            const characterBuilds = data[characterId];
            builds[characterId] = characterBuilds.map(b => new CharacterBuild(b, this));
        }

        return builds;
    }

    /**
     * @param {boolean} [playableOnly=true]
     * @returns {CharacterData[]}
     */
    getAllCharacters(playableOnly = true) {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").map(c => characterUtils.getCharactersById(c.id, this)).map(chars => chars.filter(c => !playableOnly || (playableOnly && c.isPlayable))).reduce((a, b) => [...a, ...b]);
    }

    /**
     * @param {number} id characterId
     * @param {number} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData}
     */
    getCharacterById(id, skillDepotId) {
        return new CharacterData(id, this, skillDepotId);
    }

    /**
     * @param {boolean} [excludeInvalidWeapons]
     * @returns {WeaponData[]}
     */
    getAllWeapons(excludeInvalidWeapons = true) {
        const weapons = this.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData");
        if (excludeInvalidWeapons) {
            return weapons.filter(w => w.weaponPromoteId === w.id).map(w => new WeaponData(w.id, this, w));
        } else {
            return weapons.map(w => new WeaponData(w.id, this, w));
        }
    }

    /**
     * @param {number} id
     * @returns {WeaponData}
     */
    getWeaponById(id) {
        return new WeaponData(id, this);
    }

    /**
     * @param {boolean} [includeDefaults] Whether to include default costumes
     * @returns {Costume[]}
     */
    getAllCostumes(includeDefaults = false) {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filter(c => !includeDefaults || (includeDefaults && c.isDefault)).map(c => new Costume(null, this, c));
    }

    /**
     * @param {number} id
     * @returns {Costume}
     */
    getCostumeById(id) {
        return new Costume(id, this);
    }

    /**
     * @returns {NameCard[]}
     */
    getAllNameCards() {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").filter(m => m.materialType === "MATERIAL_NAMECARD").map(n => new NameCard(n.id, this, n));
    }

    /**
     * @param {number} id
     * @returns {NameCard}
     */
    getNameCardById(id) {
        return new NameCard(id, this);
    }

    /**
     * @param {boolean} [highestRarityOnly=false]
     * @returns {Array<ArtifactData>}
     */
    getAllArtifacts(highestRarityOnly = false) {
        const excludeSetIds = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filter(s => s.DisableFilter === 1).map(s => s.setId);

        // including artifacts with invalid rarity
        const artifacts = this.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").filter(a => a.setId && !excludeSetIds.includes(a.setId));

        const validRarityArtifacts = artifacts.filter(a => {
            const allowedRarityRange = artifactRarityRangeMap[a.setId] ?? [4, 5];
            const min = highestRarityOnly ? allowedRarityRange[1] : allowedRarityRange[0];
            const max = allowedRarityRange[1];
            const stars = a.rankLevel;
            return (min <= stars && stars <= max);
        });

        const chunked = separateWithValue(validRarityArtifacts, (a) => `${a.setId}-${a.equipType}-${a.rankLevel}`);

        return Object.values(chunked).map(chunk => new ArtifactData(chunk[chunk.length - 1].id, this));
    }
}

module.exports = EnkaClient;
