# 4.1.3
- Added "Furina" to Arkhe type for character Furina.
- Made "options" arg of CachedAssetsManager#fetchAllContents optional.
# 4.1.2
- Fixed AxiosError was occurred instead of EnkaNetworkError.
# 4.1.1
- Added GenshinCharacterBuild#imageUrl.
- Better user data caching.
- Fixed ImageAssets#mihoyoUrl was incorrect.
- Made to use new rounded pfp icons even if the format is old.
# 4.1.0
**This version includes Breaking Changes**
- Added Costume#getCharacterData().
- Removed CharacterPreview#character, use CharacterPreview#costume or CharacterPreview#costume.getCharacterData() instead.
- Changed type of GenshinUser#pictureProfile to `ProfilePicture | null`.
- Removed deciphered keys from ObjectKeyManager.
# 4.0.0
**This version includes Breaking Changes**
- Moved Enka.Network-account-related codes to [enka-system](https://github.com/yuko1101/enka-system).
- Added EnkaClient#fetchEnkaGenshinAccount().
- Fixed StatProperty#isPercent was incorrect.
## Refactoring
- Renamed User#enkaUserHash to enkaGameAccountHash.
- Renamed User to GenshinUser and DetailedUser to DetailedGenshinUser.
- Renamed EnkaClient#fetchGenshinEnkaUsers() to fetchEnkaGenshinAccounts().
- Renamed EnkaClient#fetchEnkaUserGenshinBuilds() to fetchEnkaGenshinBuilds().
- Renamed EnkaClientOptions#timeout to requestTimeout.
- Moved userCacheGetter, userCacheSetter, userCacheDeleter and storeUserCache in EnkaClientOptions into EnkaClient#userCache and renamed them to getter, setter, deleter and isEnabled.
## Removed
- Removed starrailClient option from EnkaClientOptions.
- Removed EnkaClient#fetchEnkaProfile(), use EnkaSystem#fetchEnkaProfile() instead.
- Removed EnkaClient#fetchAllEnkaUsers(), use EnkaSystem#fetchEnkaGameAccounts() instead.
- Removed EnkaClient#fetchEnkaUser(), use EnkaSystem#fetchEnkaGameAccount() instead.
- Removed EnkaClient#fetchEnkaUserBuilds(), use EnkaSystem#fetchEnkaCharacterBuilds() instead.
- Removed EnkaClient#fetchStarRailEnkaUsers() and EnkaClient#fetchEnkaUserStarRailBuilds().
# 3.7.5
- Uses URLs with fewer redirects.
- Updated npm scripts to make it easier to move cache directory.
# 3.7.4
- Added CharacterData#arkhe.
- Fixed unexpected undefined in CharacterAscension#requiredAdventureRank and WeaponAscension#requiredAdventureRank.
- Made Weapon#weaponStats not to use flat data from Enka.Network API.
- Corrected errors in stats calculations by rounding and added StatProperty#rawValue.
# 3.7.3
- Added EnkaClientOptions#githubToken for less rate-limited requests to github rest api.
# 3.7.2
- Added EnkaClient#fetchGenshinEnkaUsers and EnkaClient#fetchStarRailEnkaUsers.
- Added EnkaProfile#fetchGenshinEnkaUsers and EnkaProfile#fetchStarRailEnkaUsers.
# 3.7.1
- Added WeaponData#_nameId.
# 3.7.0
- Added integration with [starrail.js](https://github.com/yuko1101/starrail.js).
    - Supported StarRail EnkaUser.
    - StarRail character builds (including saved builds in Enka.Network).
- Changed type of CharacterVoiceData#textContent to DynamicTextAssets.
# 3.6.1
- More accurate artifact mainstats.
# 3.6.0
**This version includes Breaking Changes**
- Changed type of User#profilePictureCharacter to `CostumedCharacter | null`.
- Renamed User#profilePictureCharacter to profilePicture.
- Better interface CharacterPreview with CostumedCharacter.
- More accurate total substats of artifacts.
# 3.5.0
**This version includes Breaking Changes**
- Added CharacterData#isTraveler.
- Added CharacterData#getStats().
- Renamed CharacterAscension#requiredPlayerLevel to requiredAdventureRank.
- Added WeaponData#getAscensionData().
- Added WeaponData#getStats().
# 3.4.0
**This version includes Breaking Changes**
- StatProperty#toString() no longer returns simple value text. Use StatProperty#valueText instead.
- Renamed StatProperty#getFormattedValue() to getMultipliedValue().
- Created DynamicTextAssets class for TextAssets which has placeholders.
- Made SkillAttributeAssets extend DynamicTextAssets, which extends TextAssets.
- Changed type of Skill#description to DynamicTextAssets, which extends TextAssets.
- Removed FormattedText class and FormattedText-related methods in TextAssets. Use `textAssets.setConvertToHtmlFormat(true).get()` for html formatting, and `dynamicTextAssets.getReplacedText()` for placeholders.
```js
const enka = new EnkaClient({
    defaultLanguage: "en",
    textAssetsDynamicData: {
        userInfo: {
            travelerGender: "FEMALE", // Lumine
            travelerNickname: "nickname",
            platform: "PC",
        }
    }
});

const dynamicTextAssets = /* example DynamicTextAssets, whose get() returns "#Hello {M:Mr}{F:Ms}.{NICKNAME}. {LAYOUT_MOBILE#Tap}{LAYOUT_PC#Press}{LAYOUT_PS#Press} the button." */

dynamicTextAssets.get();
// "#Hello {M:Mr}{F:Ms}.{NICKNAME}. {LAYOUT_MOBILE#Tap}{LAYOUT_PC#Press}{LAYOUT_PS#Press} the button."

dynamicTextAssets.getReplacedText();
// "Hello Ms.nickname. Press the button."

dynamicTextAssets.copyWithUserInfo({             
    travelerGender: "MALE", // Aether
    travelerNickname: "Tom",
    platform: "MOBILE", 
}).getReplacedText();
// "Hello Mr.Tom. Tap the button."
```
# 3.3.0
- Added CharacterDetails#characterId.
- Added CharacterDetails#getVoices().
- Renamed typedef CharacterVoices to CharacterVoiceActors.
- Changed constructor parameters for most classes in src/models, and added static getById methods to them.
# 3.2.5
- Fixed a error with _downloadCacheZip().
# 3.2.4
- Use unzip-stream library instead of unzipper.
- Fixed that cache directory must have been named "cache".
# 3.2.3
- Fixed error on extract cache.zip.
# 3.2.2
- Use adm-zip library instead of unzipper.
# 3.2.1
- Specified the version of unzipper due to some bugs.
# 3.2.0
**This version includes Breaking Changes**
- Renamed StatusProperty to StatProperty.
- Renamed CharacterStatus to CharacterStats, CharacterStatus#statusProperties to CharacterStats#statProperties, and CharacterStatus#getStatusProperty to CharacterStats#getStatProperty.
- Renamed Character#status to Character#stats.
# 3.1.0
**This version includes Breaking Changes**
- Removed `playableOnly` param from EnkaClient#getAllCharacters.
- Removed CharacterData#isPlayable.
- Safer type assertions. (Might be a little slow.)
# 3.0.5
**This version includes small Breaking Changes**
- Made EnkaUser#uid, EnkaUser#verificationCode, EnkaUser#verificationExpires, and EnkaUser#verificationCodeRetries nullable.
- Made Material#stars nullable.
- Added CachedAssetsManager#_validateCache for cache validation.
# 3.0.4
- Made skillDepotId optional on EnkaClient#getCharacterById ([#33](https://github.com/yuko1101/enka-network-api/pull/33))
# 3.0.3
- Renamed typedef Rarity to CharacterRarity.
- Export more objects. (Such as typedefs, functions and constants.)
# 3.0.2
- Fixed some images did not exist.
- Use regex instead of prefix to determine the image base url.
# 3.0.1
- Fixed performance issue with text maps.
# 3.0.0
**This version includes Breaking Changes**
- Rewrote the package in Typescript.
- Changed UniqueSkill#maxCharge default value to 1.
- `costume` in User#charactersPreview will be its default costume if there is no special costume.
- Use default character icon in Costume if the costume is default.
- Renamed StatusProperty#id to StatusProperty#fightProp.
- Renamed StatusProperty#type to StatusProperty#fightPropName.
- Removed bigint type from EnkaClientOptions#timeout.
- Both User#abyssFloor and User#abyssChamber are now in User#spiralAbyss.
- Added getter, setter, and deleter options in EnkaClientOptions for storing user caches.
# 2.6.1
- Allows EnkaClientOptions#timeout in number type.
# 2.6.0
- Supported text formatting in TextAssets.
- Added imageBaseUrlByPrefix option in EnkaClient.
- Added CharacterDetails#constellationIcon.
- Renamed imageBaseUrl option to defaultImageBaseUrl.
# 2.5.0
- Changed default imageBaseUrl.
# 2.4.3
- Use val instead of ival in enka response data.
# 2.4.2
- Override TextAssets#toString.
- Removed invalid mihoyo constellation_icon url.
- Made CharacterStatus#highestDamageBonus not null.
# 2.4.1
- Added ArtifactSet.getActiveSetBonus().
- Added is_cache in user data.
# 2.4.0
- Added user data caching and EnkaClient#close.
# 2.3.5
- Changed GenshinData gitlab repo url.
# 2.3.4
- Added some methods and prefer Array<TYPE> in jsdoc.
- Added EnkaClient#getArtifactById.
- Better errors.
# 2.3.3
- Added StatusProperty.getFightPropTextAssets().
- Changed default imageBaseUrl.
- Better types.
# 2.3.2
- Added Weapon#refinementRank.
- Changed order of CharacterStatus#highestDamageBonus.
# 2.3.1
- Applied thousands separator to StatusProperty#toString().
# 2.3.0
- Added EnkaClient#getAllMaterials and EnkaClient#getMaterialById.
- Added CharacterData#getAscensionData.
- Added PassiveTalent#addProps.
- Added UpgradableSkill#getUpgradeCost.
- Added CharacterStatus#highestDamageBonus and deprecated CharacterStatus#maxElementDamage
- Added imageBaseUrl option in EnkaClient.
- Better types.
- Fixed that WeaponRefinement#level was wrong.
# 2.2.2
- Added CharacterData#isArchon.
- Fixed Zhongli's constellation name
- Better types.
# 2.2.1
- Added CharacterData#weaponType.
- Throws errors if invalid id provided in get- methods in EnkaClient
# 2.2.0
- Added TextAssets#getNullable and SkillAttributeAssets#getNullableAttributeData.
- Added CachedAssetsManager#checkForUpdates.
# 2.1.2
- Allows string ids in get- methods in EnkaClient
# 2.1.1
- Override StatusProperty#toString.
# 2.1.0
- Removed unupgradable skills from Character#skillLevels and sorted Character#skillLevels.
# 2.0.6
- Added CharacterStatus#maxElementDamage.
# 2.0.5
- Added Enka.Network urls.
# 2.0.4
- Added CharacterBuild#enkaUserInfo.
# 2.0.3
- Added CharacterData#getOriginalName for Travelers.
# 2.0.2
- Added User#enkaUserHash.
# 2.0.1
- Added EnkaUser#uid.
- Added 404 status code for enka profile.
# 2.0.0
- Supported Enka.Network accounts.