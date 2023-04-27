# 3.0.0
**This version includes Breaking Changes**
- Rewrote the package in Typescript.
- Changed UniqueSkill#maxCharge default value to 1.
- `costume` in User#charactersPreview will be its default costume if there is no special costume.
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