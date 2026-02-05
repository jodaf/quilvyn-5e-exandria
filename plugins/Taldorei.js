/*
Copyright 2026, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/* jshint esversion: 6 */
/* jshint forin: false */
/* globals SRD5E, PHB5E, Tasha, Volo, Xanathar, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the Fifth Edition Taldorei campaign setting
 * source books. The Taldorei function contains methods that load rules for
 * particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the rules.  Similarly, the constant fields of Taldorei
 * (BACKGROUNDS, FEATURES, etc.) can be manipulated to modify the choices.
 */
function Taldorei() {

  if(window.PHB5E == null) {
    alert('The Taldorei module requires use of the PHB5E module');
    return;
  }

  var rules = new QuilvynRules('Taldorei', Taldorei.VERSION);
  Taldorei.rules = rules;
  rules.plugin = Taldorei;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = Taldorei.choiceRules;
  rules.removeChoice = SRD5E.removeChoice;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = Taldorei.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E.getChoices;
  rules.ruleNotes = Taldorei.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, PHB5E.ARMORS, PHB5E.SHIELDS, PHB5E.WEAPONS);
  SRD5E.magicRules(rules, PHB5E.SCHOOLS, PHB5E.SPELLS);
  SRD5E.identityRules(
    rules, PHB5E.ALIGNMENTS, Taldorei.BACKGROUNDS, Taldorei.CLASSES,
    Taldorei.DEITIES, {}, Taldorei.RACES
  );
  SRD5E.talentRules
    (rules, Taldorei.FEATS, Taldorei.FEATURES, PHB5E.GOODIES, PHB5E.LANGUAGES,
     PHB5E.SKILLS, PHB5E.TOOLS);

  if(window.Tasha != null)
    Tasha('Tasha', rules);
  if(window.Volo != null) {
    if(Volo.CHARACTER_RACES_IN_PLAY)
      Volo('Character', rules);
    if(Volo.MONSTROUS_RACES_IN_PLAY)
      Volo('Monstrous', rules);
  }
  if(window.Xanathar != null)
    Xanathar('Xanathar', rules);

  Quilvyn.addRuleSet(rules);

}

Taldorei.VERSION = '2.4.1.0';

Taldorei.BACKGROUNDS_ADDED = {
  'Ashari':
    'Equipment=' +
      '"Traveler\'s Clothes","Hunting Gear","Staff","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Nature; Choose 1 from Arcana, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Language (Choose 1 from any)","1:Elemental Harmony"',
  'Clasp Member':
    'Equipment=' +
      '"Dark Hooded Clothing","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception; Choose 1 from Sleight Of Hand, Stealth)",' +
      '"1:Tool Proficiency (Choose 1 from Disguise Kit, Forgery Kit, Thieves\' Tools)",' +
      '"1:A Favor In Turn","1:Thieves\' Cant"',
  'Lyceum Student':
    'Equipment=' +
      '"Fine Clothes","Student Uniform","Writing Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Persuasion)",' +
      '"1:Language (Choose 2 from any)","1:Student Privilege"',
  'Recovered Cultist':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception; Religion)",' +
      '"1:Language (Choose 1 from any)","1:Wicked Awareness"'
};
Taldorei.BACKGROUNDS =
  Object.assign({}, (window.PHB5E||window.SRD5E).BACKGROUNDS, Taldorei.BACKGROUNDS_ADDED);
Taldorei.CLASSES_FEATURES_ADDED = {
  'Barbarian':
    '"features.Path Of The Juggernaut ? 3:Stance Of The Mountain",' +
    '"features.Path Of The Juggernaut ? 3:Thunderous Blows",' +
    '"features.Path Of The Juggernaut ? 6:Demolishing Might",' +
    '"features.Path Of The Juggernaut ? 10:Overwhelming Cleave",' +
    '"features.Path Of The Juggernaut ? 14:Unstoppable"',
  'Cleric':
    '"features.Blood Domain ? 1:Blood Domain Bonus Proficiencies",' +
    '"features.Blood Domain ? 1:Bloodletting Focus",' +
    '"features.Blood Domain ? 2:Blood Puppet",' +
    '"features.Blood Domain ? 6:Crimson Bond",' +
    '"features.Blood Domain ? 8:Sanguine Recall",' +
    '"features.Blood Domain ? 17:Vascular Corruption Aura"',
  'Monk':
    '"features.Way Of The Cobalt Soul ? 3:Mystical Erudition",' +
    '"features.Way Of The Cobalt Soul ? 3:Extract Aspects",' +
    '"features.Way Of The Cobalt Soul ? 6:Extort Truth",' +
    '"features.Way Of The Cobalt Soul ? 6:Mind Of Mercury",' +
    '"features.Way Of The Cobalt Soul ? 11:Preternatural Counter",' +
    '"features.Way Of The Cobalt Soul ? 17:Debilitating Barrage"',
  'Sorcerer':
    '"features.Runechild ? 1:Essence Runes",' +
    '"features.Runechild ? 1:Glyphs Of Aegis",' +
    '"features.Runechild ? 6:Manifest Inscriptions",' +
    '"features.Runechild ? 6:Sigilic Augmentation",' +
    '"features.Runechild ? 14:Runic Torrent",' +
    '"features.Runechild ? 18:Arcane Exemplar Form"'
};
Taldorei.CLASSES_SELECTABLES_ADDED = {
  'Barbarian':
    '"3:Path Of The Juggernaut:Primal Path"',
  'Cleric':
    '"deityDomains =~ \'Blood\' ? 1:Blood Domain:Divine Domain"',
  'Monk':
    '"3:Way Of The Cobalt Soul:Monastic Tradition"',
  'Sorcerer':
    '"1:Runechild:Sorcerous Origin"'
};
Taldorei.CLASSES = Object.assign({}, (window.PHB5E||window.SRD5E).CLASSES);
for(let c in Taldorei.CLASSES_FEATURES_ADDED)
  Taldorei.CLASSES[c] =
    Taldorei.CLASSES[c].replace('Features=', 'Features=' + Taldorei.CLASSES_FEATURES_ADDED[c] + ',');
for(var c in Taldorei.CLASSES_SELECTABLES_ADDED)
  Taldorei.CLASSES[c] =
    Taldorei.CLASSES[c].replace('Selectables=', 'Selectables=' + Taldorei.CLASSES_SELECTABLES_ADDED[c] + ',');
Taldorei.DEITIES = {
  'The Archheart':'Alignment=CG Domain=Light,Arcana',
  'The Allhammer':'Alignment=LG Domain=Knowledge,War',
  'The Changebringer':'Alignment=CG Domain=Trickery,Nature',
  'The Dawnfather':'Alignment=NG Domain=Life,Light',
  'The Everlight':'Alignment=NG Domain=Life,Light',
  'The Knowing Mistress':'Alignment=N Domain=Knowledge,Arcana',
  'The Lawbearer':'Alignment=LN Domain=Knowledge',
  'The Matron Of Ravens':'Alignment=LN Domain=Life,Death,Blood',
  'The Moonweaver':'Alignment=CG Domain=Trickery',
  'The Platinum Dragon':'Alignment=LG Domain=Life,War',
  'The Stormlord':'Alignment=CN Domain=Tempest,War',
  'The Wildmother':'Alignment=N Domain=Nature,Tempest',

  'The Chained Oblivion':'Alignment=CE Domain=Death,Trickery',
  'The Cloaked Serpent':'Alignment=CE Domain=Trickery,Blood',
  'The Crawling King':'Alignment=NE Domain=Death,Blood',
  'The Lord Of The Hells':'Alignment=LE Domain=Trickery,Blood',
  'The Ruiner':'Alignment=CE Domain=Tempest,War',
  'The Spider Queen':'Alignment=CE Domain=Trickery,Knowledge',
  'The Strife Emperor':'Alignment=LE Domain=War',
  'The Scaled Tyrant':'Alignment=LE Domain=Trickery,War'
};
Taldorei.FEATS_ADDED = {
  'Cruel':'Type=General',
  'Dual-Focused':'Type=General Require="casterLevel >= 1"',
  'Flash Recall':'Type=General Require="casterLevel >= 1"',
  "Fortune's Grace":'Type=Special',
  'Gambler':'Type=General',
  'Mending Affinity':'Type=General',
  'Mystic Conflux':'Type=General',
  'Rapid Drinker':'Type=General',
  'Spelldriver':'Type=General Require="level >= 8"',
  'Thrown Arms Master':'Type=General'
};
Taldorei.FEATS =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATS, Taldorei.FEATS_ADDED);
Taldorei.FEATURES_ADDED = {

  // Backgrounds
  'A Favor In Turn':
    'Section=skill ' +
    'Note="May ask a 20-word favor from a contact in return for a future favor"',
  'Elemental Harmony':
    'Section=magic Note="May produce minor elemental effects"',
  "Fortune's Grace":
    'Section=feature ' +
    'Note="May gain Adv on an attack, ability, or saving throw or inflict foe Disadv on self attack 1/long rest"',
  'Student Privilege':
    'Section=skill Note="May access school tools and crafting materials"',
  'Wicked Awareness':
    'Section=skill Note="Adv on checks to uncover cult activity"',

  // Paths
  'Arcane Exemplar Form':
    'Section=magic ' +
    'Note="May discharge 6 runes to gain 40\' fly speed, +2 spell DC, resistance to spell damage, and regaining HP from casting for 3+ rd 1/long rest"',
  'Blood Domain':
    'Spells=' +
      '"1:Ray Of Sickness","1:Sleep",' +
      '"3:Crown Of Madness","3:Ray Of Enfeeblement",' +
      '"5:Haste","5:Slow",' +
      '"7:Blight","7:Stoneskin",' +
      '"9:Dominate Person","9:Hold Monster"',
  'Blood Domain Bonus Proficiencies':
    'Section=feature Note="Weapon Proficiency (Martial Weapons)"',
  'Blood Puppet':
    'Section=magic ' +
    'Note="R60\' May use Channel Divinity to force a %{levels.Cleric<8?\'Large\':\'Huge\'} target to move at half speed and attack (Constitution neg)"',
  'Bloodletting Focus':
    'Section=magic ' +
    'Note="Harming spells inflict +(spell level + 2) HP necrotic"',
  'Crimson Bond':
    'Section=magic ' +
    'Note="May use Channel Divinity with week-old target blood to learn distance, direction, HP, and conditions of target for conc up to 1 hr; may suffer 2d6 HP necrotic to share sight or sound for %{wisdomModifier>?1} rd (Constitution ends)"',
  'Debilitating Barrage':
    'Section=combat ' +
    'Note="May spend 3 Ki Points after a triple hit to inflict vulnerability to chosen damage type for 1 min (Constitution neg) and Disadv on next attack"',
  'Demolishing Might':
    'Section=combat ' +
    'Note="Melee weapons inflict x2 damage vs. objects and +1d8 HP damage vs. constructs"',
  'Essence Runes':
    'Section=magic ' +
    'Note="Spending Sorcery Points charges an equal number of runes (maximum %{levels.Sorcerer}); 5 charged runes emit a bright light in a 5\' radius"',
  'Extort Truth':
    'Section=combat ' +
    'Note="May spend 2 Ki Points after a dbl hit to prevent target from lying (Charisma neg) for 1 min"',
  'Extract Aspects':
    'Section=combat ' +
    'Note="May spend 1 Ki Point after a dbl hit to gain info about target (Constitution neg)"',
  'Glyphs Of Aegis':
    'Section=magic ' +
    'Note="May use Reaction to discharge runes, negating 1d6 damage each%{levels.Sorcerer<8?\'\':\'; touch may transfer the protection of 1 rune for 1 hr\'}"',
  'Manifest Inscriptions':
    'Section=magic ' +
    'Note="R15\' May discharge 1 rune to reveal hidden glyphs for 1 rd"',
  'Mind Of Mercury':
    'Section=combat,save ' +
    'Note=' +
      '"May spend up to %{intelligenceModifier>?1} Ki Points for an equal number of extra Reactions",' +
      '"May spend 1 Ki Point for Adv on Investigation"',
  'Mystical Erudition':
    'Section=skill,skill ' +
    'Note=' +
      '"Language (Choose %V from any)",' +
      '"May spend 1 Ki Point for Adv on Arcana, History, or Religion"',
  'Overwhelming Cleave':
    'Section=combat ' +
    'Note="May use a bonus action after attacking to attack another foe adjacent to target"',
  'Preternatural Counter':
    'Section=combat ' +
    'Note="May use Reaction for a melee attack after a target attack misses self"',
  'Runic Torrent':
    'Section=magic ' +
    'Note="May discharge spell level runes to overcome target resistance and immunity"',
  'Sanguine Recall':
    'Section=magic ' +
    'Note="May suffer up to %{(levels.Cleric+1)//2}d6 HP to recover an equal number of spell slot levels (level 5 max) 1/long rest"',
  'Sigilic Augmentation':
    'Section=magic ' +
    'Note="May use a bonus action to discharge 1 rune, gaining Adv on Strength, Dexterity, or Constitution checks for 1 rd"',
  'Stance Of The Mountain':
    'Section=combat Note="Cannot be knocked prone during rage"',
  'Thunderous Blows':
    'Section=combat ' +
    'Note="May push foe 5\' w/a successful attack (DC %{8+proficiencyBonus+strengthModifier} Strength neg)"',
  'Unstoppable':
    'Section=combat ' +
    'Note="Cannot be slowed, frightened, paralyzed, or stunned during rage; suffers 1 level of exhaustion when rage ends"',
  'Vascular Corruption Aura':
    'Section=combat ' +
    'Note="R30\' Foes suffer 2d6 HP necrotic and half healing for 1 min 1/long rest"',

  // Feats
  'Cruel':
    'Section=feature,combat,skill ' +
    'Note=' +
      '"May use %{proficiencyBonus} Cruelty Points/long rest",' +
      '"May spend 1 Cruelty Point for +1d6 damage or to regain 1d6 HP on crit",'+
      '"May spend 1 Cruelty Point for Adv on Intimidation"',
  'Dual-Focused':
    'Section=magic ' +
    'Note="Successful DC 10 + number of rd Constitution allows maintaining concentration on two spells simultaneously"',
  'Flash Recall':
    'Section=magic Note="May replace a prepared spell 1/short rest"',
  'Gambler':
    'Section=ability,feature,skill ' +
    'Note=' +
      '"+1 Charisma",' +
      '"Tool Proficiency (Choose 2 from any Game)",' +
      '"May reroll Carousing/Adv on Deception (games)/Adv on Persuasion (games)"',
  'Mending Affinity':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Constitution",' +
      '"Healing and stabilization restore +%{proficiencyBonus>?1} HP"',
  'Mystic Conflux':
    'Section=skill,magic ' +
    'Note=' +
      '"Adv on Arcana (investigate magic device)",' +
      '"May attune 4 items"',
  'Rapid Drinker':
    'Section=combat,save ' +
    'Note=' +
      '"May quaff as a bonus action",' +
      '"Adv on ingestion saves"',
  'Spelldriver':
    'Section=magic Note="May cast an additional level 1 - 2 spell/rd"',
  'Thrown Arms Master':
    'Section=ability,combat,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Strength, Dexterity)",' +
      '"+20/+40 throw range",' +
      '"May throw any weapon (one-handed have range 20/60, two-handed 15/30); light weapon returns after a missed throw"',

  // Races
  'Damage Resistance (Ravenite Dragonborn)':
    'Section=save Note="Resistance to non-magical slashing damage"',
  'Fast':'Section=ability Note="+5 Speed"',
  'Ravenite Ability Adjustment':
    'Section=ability Note="+1 Constitution/+1 Wisdom"'

};
Taldorei.FEATURES =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATURES, Taldorei.FEATURES_ADDED);
Taldorei.RACES_ADDED = {
  'Draconian Dragonborn':PHB5E.RACES.Dragonborn,
  'Ravenite Dragonborn':
    PHB5E.RACES.Dragonborn
      .replace('Dragonborn Ability Adjustment', 'Ravenite Ability Adjustment')
      .replace('Damage Resistance', 'Damage Resistance (Ravenite Dragonborn)')
      .replace('Features=', 'Features=Fast,')
};
Taldorei.RACES =
  Object.assign({}, (window.PHB5E||window.SRD5E).RACES, Taldorei.RACES_ADDED);
delete Taldorei.RACES.Dragonborn;

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Taldorei.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'Class')
    Taldorei.classRulesExtra(rules, name);
  else if(type == 'Feat')
    Taldorei.featRulesExtra(rules, name);
  else if(type == 'Race')
    Taldorei.raceRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Taldorei.classRulesExtra = function(rules, name) {
  if(name == 'Monk') {
    rules.defineRule('skillNotes.mysticalErudition',
      'levels.Monk', '=', 'source<11 ? 1 : source<17 ? 2 : 3'
    );
  }
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Taldorei.featRulesExtra = function(rules, name) {
  if(name == "Fortune's Grace")
    // Ensure that a goody note will be able to bump feat count before
    // character level 4.
    rules.defineRule
      ('featCount.General', "features.Fortune's Grace", '+=', '0');
  else if(name == 'Thrown Arms Master') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      let m = allWeapons[w].match(/range=(\d+)\/(\d+)/i);
      if(allWeapons[w].match(/thrown/i) && m) {
        rules.defineRule('weapons.' + w + '.4',
          'combatNotes.thrownArmsMaster', '=', '"' + ((+m[1]) + 20) + '/' + ((+m[2]) + 40) + '"'
        );
      }
    }
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Taldorei.raceRulesExtra = function(rules, name) {
  if(name.match(/Dragonborn/)) {
    rules.defineRule('breathWeaponShape',
      'features.Breath Weapon', '=', '"5\'x30\' line"',
      'features.Gold Dragon Ancestry', '=', '"15\' cone"',
      'features.Green Dragon Ancestry', '=', '"15\' cone"',
      'features.Red Dragon Ancestry', '=', '"15\' cone"',
      'features.Silver Dragon Ancestry', '=', '"15\' cone"',
      'features.White Dragon Ancestry', '=', '"15\' cone"'
    );
    rules.defineRule('breathWeaponEnergy',
      'features.Breath Weapon', '=', '"fire"',
      'features.Black Dragon Ancestry', '=', '"acid"',
      'features.Blue Dragon Ancestry', '=', '"lightning"',
      'features.Bronze Dragon Ancestry', '=', '"lightning"',
      'features.Copper Dragon Ancestry', '=', '"acid"',
      'features.Green Dragon Ancestry', '=', '"poison"',
      'features.Silver Dragon Ancestry', '=', '"cold"',
      'features.White Dragon Ancestry', '=', '"cold"'
    );
    rules.defineRule('selectableFeatureCount.' + name + ' (Draconic Ancestry)',
      'race', '?', 'source == "' + name + '"',
      'featureNotes.draconicAncestry', '=', '1'
    );
  }
};

/* Returns an array of plugins upon which this one depends. */
Taldorei.getPlugins = function() {
  var result = [PHB5E, SRD5E];
  if(window.Tasha != null &&
     QuilvynUtils.getKeys(Taldorei.rules.getChoices('selectableFeatures'), /Peace Domain/).length > 0)
    result.unshift(Tasha);
  if(window.Volo != null &&
     (Volo.CHARACTER_RACES_IN_PLAY || Volo.MONSTROUS_RACES_IN_PLAY))
    result.unshift(Volo);
  if(window.Xanathar != null &&
     QuilvynUtils.getKeys(Taldorei.rules.getChoices('selectableFeatures'), /Forge Domain/).length > 0)
    result.unshift(Xanathar);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
Taldorei.ruleNotes = function() {
  return '' +
    '<h2>Taldorei Quilvyn Plugin Notes</h2>\n' +
    '<p>\n' +
    'Taldorei Quilvyn Plugin Version ' + Taldorei.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn makes the Fortune\'s Grace feature of the Fate Touched\n' +
    '  background available as a special feat. To use it, add the line\n' +
    '  "* +1 Feat" to the character notes, then select Fortune\'s Grace\n' +
    '  in the Feats pull-down.\n' +
    '  </li><li>\n' +
    '  The Taldorei rule set allows you to add homebrew choices for' +
    '  all of the same types discussed in the <a href="plugins/homebrew-srd5e.html">SRD 5E Homebrew Examples document</a>.' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Portions of Quilvyn\'s Taldorei rule set are unofficial Fan Content\n' +
    'permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. © Wizards ' +
    'of the Coast LLC.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Green Ronin Publishing. Portions ' +
    'of the materials used are property of Green Ronin Publishing. © Green ' +
    'Ronin Publishing, LLC.\n' +
    '</p><p>\n' +
    'Tal\'dorei Campaign Setting © 2017 Green Ronin Publishing, LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
