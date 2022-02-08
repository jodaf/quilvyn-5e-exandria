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
 * This module loads the rules from the 5E Taldorei Reborn campaign setting
 * source book. The TaldoreiReborn function contains methods that load rules
 * for particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the rules. The constant fields of TaldoreiReborn
 * (BACKGROUNDS, PATHS, etc.) can be manipulated to modify the choices.
 */
function TaldoreiReborn() {

  if(window.PHB5E == null) {
    alert('The TaldoreiReborn module requires use of the PHB5E module');
    return;
  }

  var rules =
    new QuilvynRules('Taldorei Reborn Campaign Setting',TaldoreiReborn.VERSION);
  TaldoreiReborn.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = TaldoreiReborn.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = TaldoreiReborn.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = TaldoreiReborn.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  TaldoreiReborn.ARMORS = Object.assign({}, SRD5E.ARMORS);
  TaldoreiReborn.BACKGROUNDS =
    Object.assign({}, PHB5E.BACKGROUNDS, TaldoreiReborn.BACKGROUNDS_ADDED);
  TaldoreiReborn.CLASSES = Object.assign({}, PHB5E.CLASSES);
  for(var c in TaldoreiReborn.CLASSES_SELECTABLES_ADDED) {
    TaldoreiReborn.CLASSES[c] =
      TaldoreiReborn.CLASSES[c].replace('Selectables=', 'Selectables=' + TaldoreiReborn.CLASSES_SELECTABLES_ADDED[c] + ',');
  }
  TaldoreiReborn.FEATS =
    Object.assign({}, PHB5E.FEATS, TaldoreiReborn.FEATS_ADDED);
  TaldoreiReborn.FEATURES =
    Object.assign({}, PHB5E.FEATURES, TaldoreiReborn.FEATURES_ADDED);
  TaldoreiReborn.PATHS =
    Object.assign({}, PHB5E.PATHS, TaldoreiReborn.PATHS_ADDED);
  TaldoreiReborn.RACES = Object.assign({}, PHB5E.RACES);
  TaldoreiReborn.SPELLS =
    Object.assign({}, PHB5E.SPELLS, TaldoreiReborn.SPELLS_ADDED);
  TaldoreiReborn.TOOLS = Object.assign({}, SRD5E.TOOLS);

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, TaldoreiReborn.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, TaldoreiReborn.SPELLS);
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, TaldoreiReborn.BACKGROUNDS, TaldoreiReborn.CLASSES,
    TaldoreiReborn.DEITIES, TaldoreiReborn.PATHS, TaldoreiReborn.RACES
  );
  SRD5E.talentRules
    (rules, TaldoreiReborn.FEATS, TaldoreiReborn.FEATURES, SRD5E.GOODIES,
     SRD5E.LANGUAGES, SRD5E.SKILLS, TaldoreiReborn.TOOLS);

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

TaldoreiReborn.VERSION = '2.3.1.0';

TaldoreiReborn.BACKGROUNDS_ADDED = {
  'Ashari':
    'Equipment=' +
      '"Traveler\'s Clothes","Herbalism Kit","Staff","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Nature/Choose 1 from Arcana, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Language (Primordial)","1:Elemental Harmony" ' +
    'Languages=Primordial',
  'Clasp Member':
    'Equipment=' +
      '"Common Clothes","Tool Set","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Choose 1 from Sleight Of Hand, Stealth)",' +
      '"1:Tool Proficiency (Choose 1 from Disguise Kit, Forgery Kit, Thieves\' Tools)",' +
      '"1:A Favor In Turn","1:Thieves\' Cant"',
  'Lyceum Scholar':
    'Equipment=' +
      '"Fine Clothes","Student Uniform","Writing Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Persuasion)",' +
      '"1:Language (Choose 2 from any)","1:Academic Requisition" ' +
    'Languages=any,any',
  'Reformed Cultist':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Religion)",' +
      '"1:Language (Choose 1 from any)","1:Fell Teachings" ' +
    'Languages=any',
  'Whitestone Rifle Corps':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Athletics, Perception, Survival)",' +
      '"1:Weapon Proficiency (Firearms)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Legacy Of Secrecy","1:Rifle Corps Relationship" ' +
    'Languages=any'
};
TaldoreiReborn.CLASSES_SELECTABLES_ADDED = {
  'Barbarian':'"3:Path Of The Juggernaut:Primal Path"',
  'Bard':'"3:College Of Tragedy:Bard College"',
  'Cleric':
    '"deityDomains =~ \'Blood\' ? 1:Blood Domain:Divine Domain",' +
    '"deityDomains =~ \'Moon\' ? 1:Moon Domain:Divine Domain"',
  'Druid':'"2:Circle Of The Blighted:Druid Circle"',
  'Monk':'"3:Way Of The Cobalt Soul:Monastic Tradition"',
  'Paladin':'"3:Oath Of The Open Sea:Sacred Oath"',
  'Sorcerer':'"1:Runechild:Sorcerous Origin"',
  'Wizard':'"2:Blood Magic:Arcane Tradition"'
};
TaldoreiReborn.DEITIES = {
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
TaldoreiReborn.FEATS_ADDED = {
  'Cruel':
    'Type=General',
  'Flash Recall':
    'Type=General Require="casterLevel >= 1"',
  'Mystic Conflux':
    'Type=General',
  'Remarkable Recovery':
    'Type=General',
  'Spelldriver':
    'Type=General Require="level >= 8"',
  'Thrown Arms Master':
    'Type=General',
  'Vital Sacrifice':
    'Type=General'
};
TaldoreiReborn.FEATURES_ADDED = {

  // Backgrounds
  'A Favor In Turn':
    'Section=skill ' +
    'Note="Ask 20-word favor of contact in return for future favor"',
  'Academic Requisition':
    'Section=skill Note="Have access to school tools and crafting materials"',
  'Elemental Harmony':
    'Section=magic Note="Produce minor <i>Prestidigitation</i> effects"',
  'Fell Teachings':
    'Section=skill Note="Adv on checks to uncover cult activity"',
  'Legacy Of Secrecy':
    'Section=feature Note="TODO"',
  'Rifle Corps Relationship':
    'Section=feature Note="TODO"',

  // Paths
  'Arcane Exemplar':
    'Section=magic ' +
    'Note="Discharge 6 runes for 40\' Fly, +2 spell DC, resistance to spell damage, and regain HP from casting for 3+ rd"',
  'Aura Of Liberation':
    'Section=magic ' +
    'Note="R%V\' Targets cannot be grappled or restrained, ignore underwater movement and attack penalties"',
  'Blessing Of The Blood-Drenched Moon':
    'Section=magic ' +
    'Note="R30\' Use Channel Divinity to give target Adv on attack on foe w/in 5\' of an ally"',
  'Blessing Of The Watchful Moon':
    'Section=magic ' +
    'Note="R30\' Use Channel Divinity to give target +10 Speed and Adv on tracking for 1 hr"',
  'Blighted Shape':
    'Section=magic,skill ' +
    'Note="+2 AC and 60\' darkvision during Wild Shape",' +
         '"Skill Proficiency (Intimidation)"',
  'Blood Channeling':
    'Section=magic Note="TODO"',
  'Blood Domain Bonus Proficiencies':
    'Section=feature Note="Weapon Proficiency (Martial)"',
  'Blood Puppet':
    'Section=magic ' +
    'Note="R60\' Use Channel Divinity to force %V target to move half speed and attack (Wis neg)"',
  'Bloodletting Focus':
    'Section=magic Note="Harm spells inflict +(spell level + 2) HP necrotic"',
  'Bond Of Mutual Suffering':
    'Section=magic Note="TODO"',
  'Call Of The Shadowseeds':
    'Section=magic ' +
    'Note="Summon blighted sapling to attack w/in Define Ground %{proficiencyBonus}/long rest"',
  'Clarity Of Catha':
    'Section=magic ' +
    'Note="R30\' Target gains Adv on Wis save %{proficiencyBonus}/long rest"',
  'Crimson Bond':
    'Section=magic ' +
    'Note="Channel Divinity with target view or blood to learn distance, direction, HP, and conditions for conc or 1 hr, share sight or sound for %{wisdomModifier>?1} rd (Con neg + 2d6 HP necrotic damage to self)"',
  'Debilitating Barrage':
    'Section=combat ' +
    'Note="Spend 3 Ki Points after unarmed hit for foe vulnerability to chosen damage type for 1 min"',
  'Defile Ground':
    'Section=magic ' +
    'Note="R60\' %V\' radius becomes difficult terrain and inflicts +1d%1 HP necrotic for 1 min 1/long rest"',
  'Demolishing Might':
    'Section=combat ' +
    'Note="Melee weapons x2 damage vs. objects, +1d8 HP damage vs. constructs"',
  'Eclipse Of Ill Omen':
    'Section=magic ' +
    'Note="60\' radius red glow blocks other light and targets suffer Disadv on saves for conc or 1 min"',
  'Empowered Cantrips':
    'Section=magic Note="+%{wisdomModifier} HP cantrip damage"',
  'Essence Runes':
    'Section=magic ' +
    'Note="Spending Sorcery Points charges %{levels.Sorcerer} runes; 5 charged runes emit 5\' light"',
  'Extort Truth':
    'Section=combat ' +
    'Note="Spend 1 Ki Point after unarmed hit to prevent foe lying and gain Adv on Charisma for 10 min (Cha neg)"',
  'Extract Aspects':
    'Section=combat ' +
    'Note="Use Reaction after Flurry Of Blows hit to gain info about foe and unarmed attack Reaction to foe miss until next rest"',
  'Foul Conjuration':
    'Section=magic ' +
    'Note="Summoned creatures immune to necrotic damage and poison damage and condition, cause toxic explosion when killed"',
  'Fury Of The Tides':
    'Section=combat ' +
    'Note="Hit pushes 10\' (+{charismaModifier} HP bludgeoning if obstructed) 1/rd for 1 min"',
  'Glyph Of Hemorrhaging':
    'Section=magic Note="TODO"',
  'Glyphs Of Aegis':
    'Section=magic Note="Discharge runes to negate 1d6 damage each%1"',
  'Hurricane Strike':
    'Section=combat ' +
    'Note="Pushing foe allows ally to use Reaction for melee attack, or leap knocks prone (DC %{8 + proficiencyBonus + strengthModifier} Str neg)"',
  'Impending Misfortune':
    'Section=feature ' +
    'Note="Trade +10 on immediate attack or save for -10 on next attack or save"',
  'Incarnation Of Corruption':
    'Section=combat,save ' +
    'Note="+2 AC/Gain %{proficiencyBonus} HP from Defile Ground",' +
         '"Resistance to necrotic damage"',
  'Manifest Inscriptions':
    'Section=magic Note="R15\' Discharge 1 rune to reveal hidden glyphs"',
  'Marine Layer':
    'Section=magic Note="20\' radius obscures vision for 10 min"',
  'Mind Of Mercury':
    'Section=combat Note="Spend 1 Ki Point for extra Reaction"',
  'Mind Of Two Moons':
    'Section=magic ' +
    'Note="Use Channel Divinity to concentrate on two domain spells simultaneously"',
  'Mystical Erudition':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose %V from Arcana, History, Investigation, Nature, Religion)/+%V Language Count"',
  'Mythic Swashbuckler':
    'Section=ability,combat,save,skill ' +
    'Note="Adv on Dexterity and %{speed} climb speed for 1 min 1/long rest",' +
         '"Adv on attacks vs. adjacent foe when no other adjacent for 1 min 1/long rest",' +
         '"Adv on Dexterity for 1 min 1/long rest",' +
         '"Adv on Athletics 1/long rest"',
  'Nimbus Of Pathos':
    'Section=magic ' +
    'Note="Touched gains +4 AC, Adv on attack, and +1d10 HP radiant damage and suffers crit on 18-20 for 1 min 1/long rest"',
  'Poetry In Misery':
    'Section=feature ' +
    'Note="R30\' Regain 1 use of Bardic Inspiration when self or ally rolls a 1 on attack, ability, or save"',
  'Resolute Stance':
    'Section=combat ' +
    'Note="May trade Disadv on attacks for grapple immunity and foe Disadv on attacks"',
  'Runic Torrent':
    'Section=magic ' +
    'Note="Discharge spell level runes to overcome target resistance and immunity"',
  'Sanguine Burst':
    'Section=magic Note="TODO"',
  'Sanguine Recall':
    'Section=magic ' +
    'Note="Recover up to %V spell levels, suffer equal d8 HP damage"',
  'Sigilic Augmentation':
    'Section=magic ' +
    'Note="Discharge rune for Adv on Str, Dex, or Con checks for 1 rd"',
  'Sorrowful Fate':
    'Section=combat ' +
    'Note="Spend 1 Bardic Inpsiration die to change foe save to Charisma, failure inflicts die HP psychic"',
  'Spirit Of The Mountain':
    'Section=combat Note="Cannot be knocked prone or pushed during rage"',
  'Stormy Waters':
    'Section=combat ' +
    'Note="Foe moving into or out of range suffers 1d12 HP bludgeoning, knocked prone (Str damage only)"',
  'Tale Of Hubris':
    'Section=combat ' +
    'Note="R60\' On foe critical hit, spend 1 Bardic Inspiration die to inflict %V-20 crit range until critical hit or 1 min"',
  'Thicker Than Water':
    'Section=magic Note="TODO"',
  'Thunderous Blows':
    'Section=combat ' +
    'Note="Successful attack pushes foe 5\' (Huge foe DC %{8+proficiencyBonus+strengthModifier} Str neg)"',
  'Unstoppable':
    'Section=combat ' +
    'Note="Cannot be slowed, frightened, paralyzed, or stunned during rage"',
  'Vascular Corruption Aura':
    'Section=combat ' +
    'Note="R30\' Foes suffer 3d6 HP necrotic and half healing for 1 min 1/long rest"',

  // Feats
  'Cruel':
    'Section=feature,combat,skill ' +
    'Note="Use %V Cruelty Points/long rest",' +
         '"Spend 1 Cruelty Point for +1d6 damage or to regain 1d6 HP on crit",'+
         '"Spend 1 Cruelty Point for Adv on Intimidation"',
  'Flash Recall':'Section=magic Note="Swap prepared spell 1/short rest"',
  'Mystic Conflux':
    'Section=skill,magic ' +
    'Note="Adv on Arcana (investigate magic device)",' +
         '"Attune 4 items"',
  'Remarkable Recovery':'Section=feature Note="TODO"',
  'Spelldriver':'Section=magic Note="Cast multiple level 1 - 3 spells/rd"',
  'Thrown Arms Master':
    'Section=ability,combat ' +
    'Note="+1 Strength or Dexterity",' +
         '"Throw any weapon, +20/+40 throw range, light weapon returns after miss"',
  'Vital Sacrifice':'Section=feature Note="TODO"'

};
TaldoreiReborn.PATHS_ADDED = {
  'Blood Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Blood Domain Bonus Proficiencies","1:Bloodletting Focus",' +
      '"2:Crimson Bond","6:Blood Puppet","6:Sanguine Recall",' +
      '"8:Divine Strike","17:Vascular Corruption Aura" ' +
    'Spells=' +
      '"1:False Life,Sleep",' +
      '"2:Hold Person,Ray Of Enfeeblement",' +
      '"3:Haste,Slow",' +
      '"4:Blight,Stoneskin",' +
      '"5:Dominate Person,Hold Monster"',
  'Blood Magic':
    'Group=Wizard ' +
    'Level=levels.Wizard ' +
    'Features=' +
      '"2:Blood Channeling","2:Sanguine Burst","6:Bond Of Mutual Suffering",' +
      '"10:Glyph Of Hemorrhaging","14:Thicker Than Water"',
  'Circle Of The Blighted':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Defile Ground","2:Blighted Shape","6:Call Of The Shadowseeds",' +
      '"10:Foul Conjuration","14:Reincarnation Of Corruption"',
  'College Of Tragedy':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"3:Poetry In Misery","3:Sorrowful Fate","6:Tale Of Hubris",' +
      '"6:Impending Misforune","14:Nimbus Of Pathos"',
  'Moon Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Clarity Of Catha","2:Blessing Of The Watchful Moon",' +
      '"2:Blessing Of The Blood-Drenched Moon","6:Mind Of Two Moons",' +
      '"8:Empowered Cantrips","17:Eclipse Of Ill Oment" ' +
    'Spells=' +
      '"1:Faerie Fire,Silent Image",' +
      '"2:Invisibility,Moonbeam",' +
      '"3:Hypnotic Pattern,Major Image",' +
      '"4:Greater Invisibility,Hallucinatory Terrain",' +
      '"5:Dream,Passwall"',
  'Oath Of The Open Sea':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"3:Fury Of The Tides","3:Marine Layer","7:Aura Of Liberation",' +
      '"15:Stormy Waters","20:Mythic Swashbuckler" ' +
    'Spells=' +
      '"3:Create Or Destroy Water,Expeditious Retreat",' +
      '"5:Augury,Misty Step",' +
      '"9:Call Lightning,Freedom Of The Waves",' +
      '"13:Control Water,Freedom Of Movement",' +
      '"17:Commune With Nature,Freedom Of The Winds"',
  'Path Of The Juggernaut':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Thunderous Blows","3:Spirit Of The Mountain","6:Demolishing Might",' +
      '"6:Resolute Stance","10:Hurricane Strike",14:Unstoppable',
  'Runechild Bloodline':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Essence Runes","1:Glyphs Of Aegis","6:Manifest Inscriptions",' +
      '"6:Sigilic Augmentation","14:Runic Torrent","18:Arcane Exemplar" ' +
    'Spells=' +
      '"1:Longstrider,Protection From Evil And Good",' +
      '"3:Lesser Restoration,Protection From Poison",' +
      '"5:Glyph Of Warding,Magic Circle",' +
      '"7:Death Ward,Freedom Of Movement",' +
      '"9:Greater Restoration,Telekinesis"',
  'Way Of The Cobalt Soul':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"3:Extract Aspects","6:Extort Truth","6:Mystical Erudition",' +
      '"11:Mind Of Mercury","17:Debilitating Barrage"'
};
TaldoreiReborn.SPELLS_ADDED = {

  'Freedom Of The Waves':
    'School=Conjuration ' +
    'Level=P3 ' +
    'Description="R120\' 15\' radius inflicts 2d8 HP bludgeoning and knocks prone (Str neg)"',
  'Freedom Of The Winds':
    'School=Abjuration ' +
    'Level=P5 ' +
    'Description="Self gain fly 60\' and Adv vs. grapple, restraint, and paralysis for conc or 10 min"'

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
TaldoreiReborn.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'feat')
    TaldoreiReborn.featRulesExtra(rules, name);
  else if(type == 'path')
    TaldoreiReborn.pathRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
TaldoreiReborn.featRulesExtra = function(rules, name) {
  if(name == 'Cruel')
    rules.defineRule('featureNotes.cruel', 'proficiencyBonus', '=', null);
  else if(name == 'Thrown Arms Master')
    rules.defineRule
      ('abilityBoosts', 'abilityNotes.thrownArmsMaster', '+=', '1');
};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
TaldoreiReborn.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Blood Domain') {
    rules.defineRule
      ('magicNotes.bloodPuppet', pathLevel, '=', 'source<17?"Large":"Huge"');
    rules.defineRule
      ('magicNotes.sanguineRecall', pathLevel, '=', 'Math.floor(source / 2)');
  } else if(name == 'Circle Of The Blighted') {
    rules.defineRule
      ('magicNotes.defileGround', pathLevel, '=', 'source<10 ? 10 : 20');
    rules.defineRule('magicNotes.defileGround.1',
      'features.Defile Ground', '?', null,
      pathLevel, '=', 'source<10 ? 4 : source<14 ? 6 : 8'
    );
  } else if(name == 'College Of Tragedy') {
    rules.defineRule
      ('combatNotes.taleOfHubris', pathLevel, '=', 'source<14 ? 18 : 17');
  } else if(name == 'Oath Of The Open Sea') {
    rules.defineRule
      ('magicNotes.auraOfLiberation', pathLevel, '=', 'source<18 ? 10 : 30');
  } else if(name == 'Runechild Bloodline') {
    rules.defineRule('magicNotes.glyphsOfAegis.1',
      pathLevel, '=', 'source<8 ? "" : ", touch can transfer 1 rune for 1 hr"'
    );
  } else if(name == 'Way Of The Cobalt Soul') {
    rules.defineRule('combatNotes.mindOfMercury',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('skillNotes.mysticalErudition',
      'levels.Monk', '=', 'source<11 ? 1 : source<17 ? 2 : 3'
    );
  }

};

/* Returns an array of plugins upon which this one depends. */
TaldoreiReborn.getPlugins = function() {
  var result = [PHB5E, SRD5E];
  if(window.Tasha != null &&
     QuilvynUtils.getKeys(TaldoreiReborn.rules.getChoices('selectableFeatures'), /Peace Domain/).length > 0)
    result.unshift(Tasha);
  if(window.Volo != null &&
     (Volo.CHARACTER_RACES_IN_PLAY || Volo.MONSTROUS_RACES_IN_PLAY))
    result.unshift(Volo);
  if(window.Xanathar != null &&
     QuilvynUtils.getKeys(TaldoreiReborn.rules.getChoices('selectableFeatures'), /Forge Domain/).length > 0)
    result.unshift(Xanathar);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
TaldoreiReborn.ruleNotes = function() {
  return '' +
    '<h2>TaldoreiReborn Quilvyn Plugin Notes</h2>\n' +
    'TaldoreiReborn Quilvyn Plugin Version ' + TaldoreiReborn.VERSION + '\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the TaldoreiReborn Rule Set.\n' +
    '</p>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Portions of Quilvyn\'s TaldoreiReborn rule set are unofficial Fan Content\n' +
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
