/*
Copyright 2021, James J. Hayes

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
 * This module loads the rules from the Fifth Edition Exandria campaign setting
 * source books. The Exandria function contains methods that load rules for
 * particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the rules.  Similarly, the constant fields of Exandria
 * (BACKGROUNDS, PATHS, etc.) can be manipulated to modify the choices.
 */
function Exandria() {

  if(window.PHB5E == null) {
    alert('The Exandria module requires use of the PHB5E module');
    return;
  }

  var rules = new QuilvynRules('Exandria', Exandria.VERSION);
  Exandria.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = Exandria.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = Exandria.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Exandria.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  Exandria.ARMORS = Object.assign({}, SRD5E.ARMORS, Exandria.ARMORS_ADDED);
  Exandria.BACKGROUNDS =
    Object.assign({}, PHB5E.BACKGROUNDS, Exandria.BACKGROUNDS_ADDED);
  Exandria.CLASSES = Object.assign({}, PHB5E.CLASSES);
  for(var c in Exandria.CLASSES_SELECTABLES_ADDED) {
    Exandria.CLASSES[c] =
      Exandria.CLASSES[c].replace('Selectables=', 'Selectables=' + Exandria.CLASSES_SELECTABLES_ADDED[c] + ',');
  }
  Exandria.FEATS = Object.assign({}, PHB5E.FEATS, Exandria.FEATS_ADDED);
  Exandria.FEATURES =
    Object.assign({}, PHB5E.FEATURES, Exandria.FEATURES_ADDED);
  Exandria.PATHS = Object.assign({}, PHB5E.PATHS, Exandria.PATHS_ADDED);
  Exandria.RACES = Object.assign({}, PHB5E.RACES, Exandria.RACES_ADDED);
  delete Exandria.RACES['Dragonborn'];
  Exandria.SPELLS = Object.assign({}, PHB5E.SPELLS, Exandria.SPELLS_ADDED);
  for(var s in Exandria.SPELLS_LEVELS_ADDED) {
    Exandria.SPELLS[s] =
      Exandria.SPELLS[s].replace('Level=', 'Level=' + Exandria.SPELLS_LEVELS_ADDED[s] + ',');
  }
  Exandria.TOOLS = Object.assign({}, SRD5E.TOOLS, Exandria.TOOLS_ADDED);

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, Exandria.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, Exandria.SPELLS);
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, Exandria.BACKGROUNDS, Exandria.CLASSES,
    Exandria.DEITIES, Exandria.PATHS, Exandria.RACES
  );
  SRD5E.talentRules
    (rules, Exandria.FEATS, Exandria.FEATURES, SRD5E.GOODIES,
     SRD5E.LANGUAGES, SRD5E.SKILLS, Exandria.TOOLS);

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

Exandria.VERSION = '2.3.1.0';

Exandria.ARMORS_ADDED = {
  // TODO
};
Exandria.BACKGROUNDS_ADDED = {
  'Ashari':
    'Equipment=' +
      '"Traveler\'s Clothes","Hunting Gear","Staff","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Nature/Choose 1 from Arcana, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Elemental Harmony" ' +
    'Languages=any',
  'Clasp Member':
    'Equipment=' +
      '"Dark Hooded Clothing","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Choose 1 from Sleight Of Hand, Stealth)",' +
      '"1:Tool Proficiency (Choose 1 from Disguise Kit, Forgery Kit, Thieves\' Tools)",' +
      '"1:A Favor In Turn","1:Thieves\' Cant"',
  'Lyceum Student':
    'Equipment=' +
      '"Fine Clothes","Student Uniform","Writing Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Persuasion)",' +
      '"1:Student Privilege" ' +
    'Languages=any,any',
  'Recovered Cultist':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Religion)",' +
      '"1:Wicked Awareness" ' +
    'Languages=any'
};
Exandria.CLASSES_SELECTABLES_ADDED = {
  'Barbarian':
    '"3:Path Of The Juggernaut:Primal Path"',
  'Cleric':
    '"deityDomains =~ \'Blood\' ? 1:Blood Domain:Divine Domain"',
  'Monk':
    '"3:Way Of The Cobalt Soul:Monastic Tradition"',
  'Sorcerer':
    '"1:Runechild:Sorcerous Origin"'
};
Exandria.DEITIES = {
  'The Allhammer':'Alignment=LG Domain=Knowledge,War',
  'The Archheart':'Alignment=CG Domain=Light,Arcana',
  'The Chained Oblivion':'Alignment=CE Domain=Death,Trickery',
  'The Changebringer':'Alignment=CG Domain=Trickery,Nature',
  'The Cloaked Serpent':'Alignment=CE Domain=Trickery,Blood',
  'The Crawling King':'Alignment=NE Domain=Death,Blood',
  'The Dawnfather':'Alignment=NG Domain=Life,Light',
  'The Everlight':'Alignment=NG Domain=Life,Light',
  'The Knowing Mistress':'Alignment=N Domain=Knowledge,Arcana',
  'The Lawbearer':'Alignment=LN Domain=Knowledge',
  'The Lord Of The Hells':'Alignment=LE Domain=Trickery,Blood',
  'The Matron Of Ravens':'Alignment=LN Domain=Life,Death,Blood',
  'The Moonweaver':'Alignment=CG Domain=Trickery',
  'The Platinum Dragon':'Alignment=LG Domain=Life,War',
  'The Ruiner':'Alignment=CE Domain=Tempest,War',
  'The Scaled Tyrant':'Alignment=LE Domain=Trickery,War',
  'The Scaled Tyrant':'Alignment=LE Domain=Trickery,War',
  'The Spider Queen':'Alignment=CE Domain=Trickery,Knowledge',
  'The Stormlord':'Alignment=CN Domain=Tempest,War',
  'The Strife Emporer':'Alignment=LE Domain=War',
  'The Wildmother':'Alignment=N Domain=Nature,Tempest'
};
Exandria.FEATS_ADDED = {
  'Cruel':
    'Type=General',
  'Dual-Focused':
    'Type=General Require="casterLevel >= 1"',
  'Flash Recall':
    'Type=General Require="casterLevel >= 1"',
  'Gambler':
    'Type=General',
  'Mending Affinity':
    'Type=General',
  'Mystic Conflux':
    'Type=General',
  'Rapid Drinker':
    'Type=General',
  'Spelldriver':
    'Type=General Require="level >= 8"',
  'Thrown Arms Master':
    'Type=General'
};
Exandria.FEATURES_ADDED = {

  // Path
  'Arcane Exemplar Form':
    'Section=magic ' +
    'Note="Discharge 6 runes for 40\' Fly, +2 spell DC, resistance to spell damage, and regain HP from casting for 3+ rd"',
  'Blood Domain Bonus Proficiencies':
    'Section=feature Note="Weapon Proficiency (Martial)"',
  'Blood Puppet':
    'Section=magic ' +
    'Note="R60\' Channel Divinity to force %V target to move half speed and attack (Con neg)"',
  'Bloodletting Focus':
    'Section=magic ' +
    'Note="+(spell level + 2) HP necrotic damage on harming spells"',
  'Crimson Bond':
    'Section=magic ' +
    'Note="Study 2 oz target blood to learn distance, direction, health for conc or 1 hr, share sight or sound for %{wisdomModifier>?1} rd (Con neg + 2d6 HP necrotic damage to self)"',
  'Debilitating Barrage':
    'Section=combat ' +
    'Note="Spend 3 Ki Points after triple hit for foe DisAdv next attack, vulnerability to damage type for 1 min (Con neg)"',
  'Demolishing Might':
    'Section=combat ' +
    'Note="x2 damage vs. objects, melee weapons +1d8 HP damage vs. constructs"',
  'Essence Runes':
    'Section=magic ' +
    'Note="Spending Sorcery Points charges %V runes; 5 charged runes emit 5\' light"',
  'Extort Truth':
    'Section=combat ' +
    'Note="Spend 2 Ki Points after double hit to prevent foe lying for 1 min instead of damage (Cha neg)"',
  'Extract Aspects':
    'Section=combat ' +
    'Note="Spend 1 Ki Point after double hit to gain info about foe (Con neg)"',
  'Glyphs Of Aegis':
    'Section=magic Note="Discharge runes to negate 1d6 damage each%1"',
  'Manifest Inscriptions':
    'Section=magic Note="R15\' Discharge 1 rune to reveal hidden glyphs"',
  'Mind Of Mercury':
    'Section=combat,save ' +
    'Note="Spend %V Ki Points for %V extra reactions",' +
         '"Spend 1 Ki Point for Adv on Investigation"',
  'Mystical Erudition':
    'Section=skill ' +
    'Note="Spend 1 Ki Point for Adv on Arcana, History, and Religion/+%V Language Count"',
  'Overwhelming Cleave':
    'Section=combat Note="Bonus attack on second foe adjacent to first"',
  'Preternatural Counter':'Section=combat Note="OA after foe miss"',
  'Runic Torrent':
    'Section=magic ' +
    'Note="Discharge spell level runes to overcome target resistance and immunity"',
  'Sanguine Recall':
    'Section=magic ' +
    'Note="Self suffer %Vd6 HP damage to recover %V spell slot levels 1/long rest"',
  'Sigilic Augmentation':
    'Section=magic ' +
    'Note="Discharge rune for Adv on Str, Dex, or Con checks for 1 rd"',
  'Stance Of The Mountain':
    'Section=combat Note="Cannot be knocked prone during rage"',
  'Thunderous Blows':
    'Section=combat ' +
    'Note="Successful attack pushes foe 5\', may follow (DC %V Str neg)"',
  'Unstoppable':
    'Section=combat ' +
    'Note="Cannot be slowed, frightened, paralyzed, or stunned during rage"',
  'Vascular Corruption Aura':
    'Section=combat ' +
    'Note="R30\' Foes suffer 2d6 necrotic HP for 1 min 1/long rest"',

  //
  'A Favor In Turn':
    'Section=skill ' +
    'Note="Ask 20-word favor of contact in return for future favor"',
  'Ashari':
    'Section=feature ' +
    'Note="Ask 20-word favor of contact in return for future favor"',
  'Cruel':
    'Section=feature,combat,skill ' +
    'Note="%V cruelty points/long rest",' +
         '"Spend 1 cruelty point for +1d6 damage, regain 1d6 HP on critical",' +
         '"Spend 1 cruelty point for Intimidation Adv"',
  'Dual-Focused':
    'Section=magic ' +
    'Note="Concentrate on two spells simultaneously (Con to maintain)"',
  'Elemental Harmony':
    'Section=magic Note="Minor <i>Prestidigitation</i> effects"',
  'Flash Recall':'Section=magic Note="Swap prepared spell 1/short rest"',
  'Gambler':
    'Section=ability,feature,skill ' +
    'Note="+1 Charisma",' +
         '"Reroll Carousing result",' +
         '"Tool Proficiency(Choose 2 from any Game)/Adv Deception (games)/' +
          'Adv Persuasion (games)"',
  'Mending Affinity':
    'Section=ability,combat ' +
    'Note="+1 Constitution",' +
         '"+%V HP from healer\'s kit or potion"',
  'Mystic Conflux':
    'Section=skill,magic ' +
    'Note="Adv Arcana to id magic",' +
         '"Attune 4 items"',
  'Rapid Drinker':
    'Section=combat,save ' +
    'Note="Quaff as bonus action",' +
         '"Adv ingestion saves"',
  'Ravenite Ability Adjustment':
    'Section=ability Note="+1 Constitution/+1 Wisdom"',
  'Spelldriver':'Section=magic Note="Cast multiple spells (1 level 3+)/tn"',
  'Student Privilege':
    'Section=skill Note="Access to school tools and crafting materials"',
  'Thrown Arms Master':
    'Section=ability,combat ' +
    'Note="+1 abilityBoosts",' +
         '"Throw any weapon, +20 throw range, light weapon returns after miss"',
  'Wicked Awareness':'Section=skill Note="Adv checks to uncover cult activity"'

};
Exandria.PATHS_ADDED = {
  'Blood Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Blood Domain Bonus Proficiencies","1:Bloodletting Focus",' +
      '"2:Blood Puppet","6:Crimson Bond","8:Sanguine Recall",' +
      '"17:Vascular Corruption Aura" ' +
    'Spells=' +
      '"1:Ray Of Sickness,Sleep",' +
      '"2:Crown Of Madness,Ray Of Enfeeblement",' +
      '"3:Haste,Slow",' +
      '"4:Blight,Stoneskin",' +
      '"5:Dominate Person,Hold Monster"',
  'Path Of The Juggernaut':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Stance Of The Mountain","3:Thunderous Blows","6:Demolishing Might",' +
      '"10:Overwhelming Cleave",14:Unstoppable',
  'Runechild Bloodline':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Essence Runes","1:Glyphs Of Aegis","6:Manifest Inscriptions",' +
      '"6:Sigilic Augmentation","14:Runic Torrent","18:Arcane Exemplar Form"',
  'Way Of The Cobalt Soul':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"3:Mystical Erudition","3:Extract Aspects","6:Extort Truth",' +
      '"6:Mind Of Mercury","11:Preternatural Counter","17:Debilitating Barrage"'
};
Exandria.RACES_ADDED = {
  'Draconian Dragonborn':PHB5E.RACES['Dragonborn'],
  'Ravenite Dragonborn':
    PHB5E.RACES['Dragonborn']
      .replace('Dragonborn Ability Adjustment', 'Ravenite Ability Adjustment')
      .replace('Dragonborn Damage Resistance', 'Ravenite Damage Resistance')
      .replace('Features=', 'Features="Fleet Of Foot",')
};
Exandria.SPELLS_ADDED = {
  // TODO
};
Exandria.SPELLS_LEVELS_ADDED = {
  // TODO
};
Exandria.TOOLS_ADDED = {
  // TODO
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Exandria.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'feat')
    Exandria.featRulesExtra(rules, name);
  else if(type == 'path')
    Exandria.pathRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Exandria.featRulesExtra = function(rules, name) {
  if(name == 'Cruel') {
    rules.defineRule('featureNotes.cruel', 'proficiencyBonus', '=', null);
  } else if(name == 'Mending Affinity') {
    rules.defineRule
      ('combatNotes.mendingAffinity', 'proficiencyBonus', '=', null);
  }
};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
Exandria.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Blood Domain') {
    rules.defineRule
      ('magicNotes.bloodPuppet', pathLevel, '=', 'source<8 ? "Large" : "Huge"');
    rules.defineRule('magicNotes.sanguineRecall',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
  } else if(name == 'Path Of The Juggernaut') {
    rules.defineRule('combatNotes.thunderousBlows',
      'strengthModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
  } else if(name == 'Runechild Bloodline') {
    rules.defineRule('magicNotes.glyphsOfAegis.1',
      pathLevel, '=', 'source<8 ? "" : ", touch can transfer 1 rune for 1 hr"'
    );
    rules.defineRule('magicNotes.essenceRunes', 'levels.Sorcerer', '=', null);
  } else if(name == 'Way Of The Cobalt Soul') {
    rules.defineRule('combatNotes.mindOfMercury',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('skillNotes.mysticalErudition',
      'levels.Monk', '=', 'source >= 17 ? 3 : source >= 11 ? 2 : 1'
    );
  }

};

/* Returns an array of plugins upon which this one depends. */
Exandria.getPlugins = function() {
  var result = [PHB5E, SRD5E];
  if(window.Tasha != null &&
     QuilvynUtils.getKeys(Exandria.rules.getChoices('selectableFeatures'), /Peace Domain/).length > 0)
    result.unshift(Tasha);
  if(window.Volo != null &&
     (Volo.CHARACTER_RACES_IN_PLAY || Volo.MONSTROUS_RACES_IN_PLAY))
    result.unshift(Volo);
  if(window.Xanathar != null &&
     QuilvynUtils.getKeys(Exandria.rules.getChoices('selectableFeatures'), /Forge Domain/).length > 0)
    result.unshift(Xanathar);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
Exandria.ruleNotes = function() {
  return '' +
    '<h2>Exandria Quilvyn Plugin Notes</h2>\n' +
    'Exandria Quilvyn Plugin Version ' + Exandria.VERSION + '\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Exandria Rule Set.\n' +
    '</p>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Quilvyn\'s Exandria rule set is unofficial Fan Content permitted ' +
    'under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Tal\'dorei Campaign Setting © 2017 Green Ronin Publishing, LLC.\n' +
    '</p><p>\n' +
    'Explorer\'s Guide to Wildemount © 2020 Wizards of the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
