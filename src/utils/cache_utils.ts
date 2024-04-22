import { EnkaClient } from "../client/EnkaClient";
import { ArtifactData } from "../models/artifact/ArtifactData";

/**
 * @returns whether the cache is valid or not
 */
export function validateCache(enka: EnkaClient, showLog: boolean): boolean {
    let result = true;

    const artifactsCheck = checkArtifacts(enka.getAllArtifacts(false), showLog);

    if (!artifactsCheck) result = false;
    const textAssetsChecks = [enka.getAllCharacters(), enka.getAllWeapons(), enka.getAllCostumes(), enka.getAllMaterials(), enka.getAllArtifacts(), enka.getAllArtifactSets()].reduce<unknown[]>((a, b) => [...a, ...b], []).map(target => [target, checkTextAssets(target as unknown as { [s: string]: unknown })]);
    if (textAssetsChecks.some(check => Object.keys(check[1] as { [s: string]: unknown }).length !== 0) && showLog) console.warn("Missing TextHashMapId", textAssetsChecks.filter(check => Object.keys(check[1] as { [s: string]: unknown }).length !== 0));

    const noSkills = enka.getAllCharacters().filter(c => !c.elementalSkill || !c.normalAttack);
    if (noSkills.length !== 0) {
        result = false;
        if (showLog) console.error("No skills", noSkills);
    }

    const noFriendshipNameCard = enka.getAllCharacters().filter(c => !c.nameCard && c.id !== 10000005 && c.id !== 10000007);
    if (noFriendshipNameCard.length !== 0) {
        result = false;
        if (showLog) console.error("No friendship namecard", noFriendshipNameCard);
    }

    const noConstellationNames = enka.getAllCharacters().filter(c => !c.details?.constellation?.getNullable());
    if (noConstellationNames.length !== 0) {
        result = false;
        if (showLog) console.error("No constellation name", noConstellationNames);
    }

    return result;
}


function checkArtifacts(artifacts: ArtifactData[], showLog: boolean): boolean {
    let result = true;
    const list: string[] = [];
    for (const a of artifacts) {
        const name = `${a.stars}:${a.name.get()}`;
        if (list.includes(name)) {
            if (showLog) console.error(`Duplicated artifacts detected! ${name}`);
            result = false;
        }
        list.push(name);
    }
    return result;
}

/**
 * @param {object} obj
 * @param {string[]} route
 * @returns {object}
 */
function checkTextAssets(obj: { [s: string]: unknown }, route: string[] = []): { [id: string]: string[] } {
    const keys = Object.keys(obj);
    let missing: { [id: string]: string[] } = {};
    for (const key of keys) {
        const value = obj[key];
        const currentRoute = [...route, key];
        if (value == null || value == undefined || typeof value !== "object") continue;
        const valueObject = value as { [s: string]: unknown };
        if (valueObject.fetchUser) continue; // ignore enkaclient
        if (valueObject.get && typeof valueObject.get === "function") {
            // if text assets
            try {
                valueObject.get();
            } catch (e) {
                missing[valueObject.id as string] = currentRoute;
            }
        } else if (typeof value === "object") {
            missing = { ...missing, ...checkTextAssets(valueObject, currentRoute) };
        }
    }
    return missing;
}