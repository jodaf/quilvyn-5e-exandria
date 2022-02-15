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
 * This module loads the rules from the Fifth Edition Wildemount campaign setting
 * source books. The Wildemount function contains methods that load rules for
 * particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the rules.  Similarly, the constant fields of Wildemount
 * (BACKGROUNDS, PATHS, etc.) can be manipulated to modify the choices.
 */
function Wildemount() {

  if(window.PHB5E == null) {
    alert('The Wildemount module requires use of the PHB5E module');
    return;
  }

  var rules = new QuilvynRules('Wildemount', Wildemount.VERSION);
  Wildemount.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = Wildemount.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = Wildemount.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Wildemount.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  Wildemount.ARMORS = Object.assign({}, SRD5E.ARMORS);
  Wildemount.BACKGROUNDS =
    Object.assign({}, PHB5E.BACKGROUNDS, Wildemount.BACKGROUNDS_ADDED);
  Wildemount.CLASSES = Object.assign({}, PHB5E.CLASSES);
  for(var c in Wildemount.CLASSES_SELECTABLES_ADDED) {
    Wildemount.CLASSES[c] =
      Wildemount.CLASSES[c].replace('Selectables=', 'Selectables=' + Wildemount.CLASSES_SELECTABLES_ADDED[c] + ',');
  }
  Wildemount.FEATS = Object.assign({}, PHB5E.FEATS, Wildemount.FEATS_ADDED);
  Wildemount.FEATURES =
    Object.assign({}, PHB5E.FEATURES, Wildemount.FEATURES_ADDED);
  Wildemount.PATHS = Object.assign({}, PHB5E.PATHS, Wildemount.PATHS_ADDED);
  Wildemount.RACES = Object.assign({}, PHB5E.RACES, Wildemount.RACES_ADDED);
  Wildemount.SPELLS = Object.assign({}, PHB5E.SPELLS, Wildemount.SPELLS_ADDED);
  Wildemount.TOOLS = Object.assign({}, SRD5E.TOOLS);

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, Wildemount.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, Wildemount.SPELLS);
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, Wildemount.BACKGROUNDS, Wildemount.CLASSES,
    Wildemount.DEITIES, Wildemount.PATHS, Wildemount.RACES
  );
  SRD5E.talentRules
    (rules, Wildemount.FEATS, Wildemount.FEATURES, SRD5E.GOODIES,
     SRD5E.LANGUAGES, SRD5E.SKILLS, Wildemount.TOOLS);

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

Wildemount.VERSION = '2.3.1.0';

Wildemount.BACKGROUNDS_ADDED = {
  'Grinner':
    'Equipment=' +
      '"Fine Clothes","Disguise Kit","Musical Instrument","Gold Ring","15 GP" '+
    'Features=' +
      '"1:Skill Proficiency (Deception/Performance)",' +
      '"1:Tool Proficiency (Thieves\' Tools/Choose 1 from any Music)",' +
      '"1:Ballad Of The Grinning Fool"',
  'Volstrucker Agent':
    'Equipment=' +
      '"Common Clothes","Black Cloak","Poisoner\'s Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Stealth)",' +
      '"1:Tool Proficiency (Poisoner\'s Kit)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Shadow Network" ' +
    'Languages=any'
};
Wildemount.CLASSES_SELECTABLES_ADDED = {
  'Fighter':
    '"3:Echo Knight:Martial Archetype"',
  'Wizard':
    '"2:Chronurgy Magic:Arcane Tradition",' +
    '"2:Graviturgy Magic:Arcane Tradition"'
};
Wildemount.DEITIES = {
  'Avandra, The Change Bringer':'Alignment=CG Domain=Nature,Trickery',
  'Bahamut, The Platinum Dragon':'Alignment=LG Domain=Life,Order,War',
  'Corellon, The Archheart':'Alignment=CG Domain=Arcana,Light',
  'Erathis, The Lawbearer':'Alignment=LN Domain=Knowledge,Order',
  'Ioun, The Knowing Mentor':'Alignment=N Domain=Arcana,Knowledge',
  'Kord, The Storm Lord':'Alignment=CN Domain=Tempest,War',
  'Melora, The Wild Mother':'Alignment=N Domain=Life,Nature,Tempest',
  'Moradin, The All-Hammer':'Alignment=LG Domain=Forge,Knowledge,War',
  'Pelor, The Dawn Father':'Alignment=NG Domain=Life,Light,Nature',
  'Raei, The Everlight':'Alignment=NG Domain=Life,Light',
  'The Raven Queen, Matron Of Ravens':'Alignment=LN Domain=Death,Grave',
  'Sehanine, The Moonweaver':'Alignment=CG Domain=Arcana,Nature,Trickery',

  'Asmodeus, The Lord Of The Hells':'Alignment=LE Domain=Trickery,War',
  'Bane, The Strife Emperor':'Alignment=LE Domain=Conquest,Tyranny',
  'Gruumsh, The Ruiner':'Alignment=CE Domain=Death,Tempest,War',
  'Lolth, The Spider Queen':'Alignment=CE Domain=Knowledge,Trickery',
  'Tharizdun, The Chained Oblivion':'Alignment=CE Domain=Death,Grave,Trickery',
  'Tiamat, The Scaled Tyrant':'Alignment=LE Domain=Order,Trickery,War',
  'Torog, The Crawling King':'Alignment=NE Domain=Death,Trickery',
  'Vecna, The Whispered One':'Alignment=NE Domain=Arcana,Death,Grave,Knowledge',
  'Zehir, The Cloaked Serpent':'Alignment=CE Domain=Nature,Trickery'
};
Wildemount.FEATS_ADDED = {
  'Hollow One':'Type=Special'
};
Wildemount.FEATURES_ADDED = {

  // Backgrounds
  'Ballad Of The Grinning Fool':
    'Section=feature Note="May find shelter in city for self and companions"',
  'Shadow Network':
    'Section=feature Note="May write to distant Volstrucker members"',

  // Feats
  'Hollow One':
    'Section=feature ' +
    'Note="Returned from death/Has Ageless, Cling To Life, Revenance, and Unsettling Presence features"',

  // Paths
  'Adjust Density':
    'Section=magic Note="R30\' Dbl or halve weight of %V target (-10/+10 Speed, Adv/Disadv on Str) for conc or 1 min"',
  'Arcane Abeyance':
    'Section=magic ' +
    'Note="Store level 1 - 4 spell in bead for use w/in 1 hr 1/short rest"',
  'Chronal Shift':
    'Section=combat ' +
    'Note="R30\' Use Reaction to force attack, ability, or save reroll 2/long rest"',
  'Convergent Future':
    'Section=combat ' +
    'Note="R60\' Suffer exhaustion to dictate whether attack, ability, or save roll succeeds"',
  'Echo Avatar':
    'Section=magic ' +
    'Note="R1000\' May see and hear via Manifest Echo for 10 min"',
  'Event Horizon':
    'Section=magic ' +
    'Note="30\' radius inflicts 2d10 HP force and immobility for 1 rd on foes (Str half damage, 1/3 Speed) for conc or 1 min 1/long rest (level 3 spell slot refreshes)"',
  'Gravity Well':
    'Section=magic Note="Successful targeted spell moves target 5\'"',
  'Legion Of One':
    'Section=combat ' +
    'Note="Minimum 1 Unleash Incarnation use after initiative/May create 2 Manifest Echos simultaneously"',
  'Manifest Echo':
    'Section=combat ' +
    'Note="R30\' Copy of self (AC %{14+proficiencyBonus}, HP 1, MV 30\') can swap places and transmit attacks and opportunity attacks"',
  'Momentary Stasis':
    'Section=magic ' +
    'Note="R60\' Incapacitates large target for 1 rd (Con neg) %{intelligenceModifier>?1}/long rest"',
  'Reclaim Potential':
    'Section=combat ' +
    'Note="Gain 2d6+%{constitutionModifier} temporary HP when Manifest Echo destroyed %{constitutionModifier>?1}/long rest"',
  'Shadow Martyr':
    'Section=combat Note="May use Manifest Echo to absorb attack 1/short rest"',
  'Temporal Awareness':'Section=combat Note="+%V Initiative"',
  'Unleash Incarnation':
    'Section=combat ' +
    'Note="May make extra attack through Manifest Echo %{constitutionModifier>?1}/long rest"',
  'Violent Attraction':
    'Section=combat ' +
    'Note="R60\' Use Reaction to inflict +1d10 HP on weapon target or +2d10 HP on falling target %{intelligenceModifier>?1}/long rest"',

  // Races
  'Aarakocra Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Acid Resistance':'Section=save Note="Resistance to acid damage"',
  'Ageless':'Section=feature Note="Immune to aging"',
  'Air Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Dexterity"',
  'Amphibious':'Section=feature Note="Breathe air and water"',
  'Blessing Of The Moon Weaver':
    'Section=magic Note="Know <i>Light</i> cantrip%1"',
  'Call To The Wave':'Section=magic Note="Know <i>Shape Water</i> cantrip%1"',
  'Child Of The Sea':'Section=ability Note="30\' Swim, can breathe water"',
  'Child Of The Wood':'Section=magic Note="Know <i>Druidcraft</i> cantrip%1"',
  'Claws':'Section=combat Note="Use claws as natural slashing weapon"',
  'Cling To Life':
    'Section=combat Note="Successful death saving throw restores 1 HP"',
  'Draconblood Ability Adjustment':
    'Section=ability Note="+2 Intelligence/+1 Charisma"',
  'Earth Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Strength"',
  'Earth Walk':
    'Section=ability Note="Normal movement over difficult earth and stone"',
  'Fire Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Intelligence"',
  'Fire Resistance':'Section=save Note="Resistance to fire damage"',
  'Flight':'Section=ability Note="50\' Fly"',
  'Forceful Presence':
    'Section=skill Note="Adv on Intimidation or Persuasion 1/short rest"',
  'Friend Of The Sea':
    'Section=feature Note="May communicate w/swimming creatures"',
  'Goliath Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Hold Breath':'Section=feature Note="May hold breath for 1 hr"',
  'Incisive Sense':'Section=skill Note="Adv on Investigation and Insight"',
  'Lotusden Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Mingle With The Wind':
     'Section=magic Note="Cast <i>Levitate</i> 1/long rest"',
  'Mountain Born':
    'Section=feature ' +
    'Note="Acclimated to high elevations and cold environments"',
  'Natural Armor':'Section=combat Note="Shell gives AC 17, cannot wear armor"',
  'Natural Athlete':'Section=skill Note="Skill Proficiency (Athletics)"',
  'Pallid Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Pass Without Trace':
    'Section=magic Note="Cast <i>Pass Without Trace</i> 1/long rest"',
  'Primal Intuition':
    'Section=feature ' +
    'Note="Skill Proficiency (Choose 2 from Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, Survival)"',
  'Powerful Build':'Section=ability Note="x2 Carry/x2 Lift"',
  'Ravenite Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Reach To The Blaze':
    'Section=magic Note="Know <i>Produce Flame</i> cantrip%1"',
  'Revenance':'Section=feature Note="Detects as undead"',
  'Sea Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Sea Elf Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Light Crossbow/Net/Spear/Trident)"',
  'Shell Defense':
    'Section=combat ' +
    'Note="Withdrawal into shell gives +4 AC and Adv on Str and Con saves, inflicts immobility, Disadv on Dex saves, and no actions or reactions"',
  'Survival Instinct':'Section=skill Note="Skill Proficiency (Survival)"',
  "Stone's Endurance":
    'Section=combat ' +
    'Note="Reduce damage by 1d12+%{constitutionModifier} 1/short rest"',
  'Swim':'Section=ability Note="30\' Swim"',
  'Talons':'Section=combat Note="Use talons as natural slashing weapon"',
  'Timberwalk':
    'Section=ability,feature ' +
    'Note="Normal movement through difficult undergrowth",' +
         '"Trackers suffer Disadv"',
  'Tortle Ability Adjustment':'Section=ability Note="+2 Strength/+1 Wisdom"',
  'Unending Breath':'Section=feature Note="May hold breath indefinitely"',
  'Unsettling Presence':'Section=combat Note="R15\' Inflict Disadv on next target save for 1 min 1/long rest"',
  'Vengeful Assault':
    'Section=combat ' +
    'Note="Use Reaction to attack after taking damage 1/short rest"',
  'Water Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Wisdom"'

};
Wildemount.PATHS_ADDED = {
  'Echo Knight':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Manifest Echo","3:Unleash Incarnation","7:Echo Avatar",' +
      '"10:Shadow Martyr","15:Reclaim Potential","18:Legion Of One"',
  'Chronurgy Magic':
    'Group=Wizard ' +
    'Level=levels.Wizard ' +
    'Features=' +
      '"2:Chronal Shift","2:Temporal Awareness","6:Momentary Stasis",' +
      '"10:Arcane Abeyance","14:Convergent Future"',
  'Graviturgy Magic':
    'Group=Wizard ' +
    'Level=levels.Wizard ' +
    'Features=' +
      '"2:Adjust Density","6:Gravity Well","10:Violent Attraction",' +
      '"14:Event Horizon"'
};
Wildemount.RACES_ADDED = {
  'Aarakocra':
    'Features=' +
      '"Aarakocra Ability Adjustment",Flight,Slow,Talons ' +
    'Languages=Aarakocra,Auran,Common',
  'Air Genasi':
    'Features=' +
      '"Air Genasi Ability Adjustment","Mingle With The Wind",' +
      '"Unending Breath" ' +
    'Languages=Common,Primordial',
  'Draconblood':SRD5E.RACES.Dragonborn
    .replace('Dragonborn Ability Adjustment', 'Draconblood Ability Adjustment')
    .replace('Dragonborn Damage Resistance', 'Forceful Presence')
    .replace('Features=', 'Features=Darkvision,'),
  'Earth Genasi':
    'Features=' +
      '"Earth Genasi Ability Adjustment","Earth Walk","Pass Without Trace" ' +
    'Languages=Common,Primordial',
  'Fire Genasi':
    'Features=' +
      'Darkvision,"Fire Genasi Ability Adjustment","Fire Resistance",' +
      '"Reach To The Blaze" ' +
    'Languages=Common,Primordial',
  'Goliath':
    'Features=' +
      '"Goliath Ability Adjustment","Mountain Born","Natural Athlete",' +
      '"Powerful Build","Stone\'s Endurance" ' +
    'Languages=Common,Giant',
  'Lotusden Halfling':
    'Features=' +
      'Brave,"Child Of The Wood","Halfling Nimbleness",' +
      '"Lotusden Halfling Ability Adjustment","Lucky Halfling",Slow,Small,' +
      'Timberwalk ' +
    'Languages=Common,Halfling',
  'Pallid Elf':
    'Features=' +
      '"Blessing Of The Moon Weaver",Darkvision,"Fey Ancestry",' +
      '"Incisive Sense","Keen Senses","Pallid Elf Ability Adjustment",Trance ' +
    'Languages=Common,Elvish',
  'Ravenite':SRD5E.RACES.Dragonborn
    .replace('Dragonborn Ability Adjustment', 'Ravenite Ability Adjustment')
    .replace('Dragonborn Damage Resistance', 'Vengeful Assault')
    .replace('Features=', 'Features=Darkvision,'),
  'Sea Elf':
    'Features=' +
      '"Child Of The Sea",Darkvision,"Fey Ancestry","Friend Of The Sea",' +
      '"Keen Senses","Sea Elf Ability Adjustment","Sea Elf Training",Trance ' +
    'Languages=Aquan,Common,Elvish',
  'Tortle':
    'Features=' +
      'Claws,"Hold Breath","Natural Armor","Shell Defense",' +
      '"Survival Instinct","Tortle Ability Adjustment" ' +
    'Languages=Aquan,Common',
  'Water Genasi':
    'Features=' +
      '"Acid Resistance",Amphibious,"Call To The Wave",Swim,' +
      '"Water Genasi Ability Adjustment" ' +
    'Languages=Common,Primordial'
};
if(window.Volo != null) {
  Wildemount.RACES_ADDED['Orc'] =
    Volo.MONSTROUS_RACES['Orc'].replace('Menacing', '"Primal Intuition"');
}
Wildemount.SPELLS_ADDED = {
  'Dark Star':
    'School=Evocation ' +
    'Level=W8 ' +
    'Description="R150\' 40\' radius sphere inflicts 8d10 HP force (Con half), disintegrates dead, negates sight and sound for conc or 1 min"',
  "Fortune's Favor":
    'School=Divination ' +
    'Level=W2 ' +
    'Description="R60\' Target gains Adv on 1 attack, ability, or save, or foe Disadv on 1 attack, within 1 hr"',
  'Gift Of Alacrity':
    'School=Divination ' +
    'Level=W1 ' +
    'Description="Willing touched gains +1d8 initiative for 8 hr"',
  'Gravity Fissure':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="5\'x100\' line inflicts 8d8 HP force (Con half), pulls and inflicts 8d8 HP force on creatures w/in 10\' (Con neg)"',
  'Gravity Sinkhole':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description="R120\' 20\' radius inflicts 5d10 HP force and pulls to center (Con half HP only)"',
  'Immovable Object':
    'School=Transmutation ' +
    'Level=W2 ' +
    'Description="Touched 10 lb object movable only by specified creatures (Str move 10\') for 1 hr"',
  'Magnify Gravity':
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="R60\' 10\' radius inflicts 2d8 HP force and half speed (Con half HP only) for 1 rd"',
  'Pulse Wave':
    'School=Evocation ' +
    'Level=W3 ' +
    'Description="30\' cone inflicts 6d6 HP force and pulls or pushes 15\' (Con half HP only)"',
  'Ravenous Void':
    'School=Evocation ' +
    'Level=W9 ' +
    'Description="R1000\' 20\' radius inflicts 5d10 HP force and restrains, destroys dead and nonmagical objects, and creates 120\' radius difficult terrain that pulls to center for conc or 1 min"',
  'Reality Break':
    'School=Conjuration ' +
    'Level=W8 ' +
    'Description="R60\' Target loses reactions and suffers random effects (Wis neg) for conc or 1 min"',
  'Sapping Sting':
    'School=Necromancy ' +
    'Level=W0 ' +
    'Description="R30\' Target suffers %{(level+7)//6}d4 HP and knocked prone (Con neg)"',
  'Shape Water': // Copied from Xanathar's
    'School=Transmutation ' +
    'Level=D0,S0,W0 ' +
    'Description="R30\' 5\' cu water moves 5\' or forms animated shapes, changes color or opacity, or freezes for 1 hr"',
  'Temporal Shunt':
    'School=Transmutation ' +
    'Level=W5 ' +
    'Description="R120\' Target disappears for 1 rd, losing action (Wis neg)"',
  'Tether Essence':
    'School=Necromancy ' +
    'Level=W7 ' +
    'Description="R60\' Two targets lose/gain HP identically for conc or 1 hr or until 0 HP (Con neg, Disadv if w/in 30\')"',
  'Time Ravage':
    'School=Necromancy ' +
    'Level=W9 ' +
    'Description="R90\' Target aged to near-death, suffers 10d12 HP necrotic (Con half HP only)"',
  'Wristpocket':
    'School=Conjuration ' +
    'Level=W2 ' +
    'Description="Touched 5 lb object moves to/from extradimensional space for conc or 1 hr"'
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Wildemount.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'Feat')
    Wildemount.featRulesExtra(rules, name);
  else if(type == 'Path')
    Wildemount.pathRulesExtra(rules, name);
  else if(type == 'Race')
    Wildemount.raceRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Wildemount.featRulesExtra = function(rules, name) {
  if(name == 'Hollow One') {
    rules.defineRule('features.Ageless', 'featureNotes.hollowOne', '=', '1');
    rules.defineRule
      ('features.Cling To Life', 'featureNotes.hollowOne', '=', '1');
    rules.defineRule('features.Revenance', 'featureNotes.hollowOne', '=', '1');
    rules.defineRule
      ('features.Unsettling Presence', 'featureNotes.hollowOne', '=', '1');
    // Ensure that a goody note will be able to bump feat count before
    // character level 4.
    rules.defineRule('featCount.General', 'features.Hollow One', '+=', '0');
  }
};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
Wildemount.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Chronurgy Magic') {
    rules.defineRule
      ('combatNotes.temporalAwareness', 'intelligenceModifier', '=', null);
    rules.defineRule('magicNotes.adjustDensity',
      pathLevel, '=', 'source<10 ? "large" : "huge"'
    );
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Wildemount.raceRulesExtra = function(rules, name) {
  if(name == 'Aarakocra') {
    SRD5E.weaponRules(rules, 'Talons', 0, ['Un'], '1d4', null);
    rules.defineRule('weapons.Talons', 'combatNotes.talons', '=', '1');
  } else if(name == 'Draconblood') {
    rules.defineRule('selectableFeatureCount.Draconblood',
      'race', '=', 'source == "Draconblood" ? 1 : null'
    );
  } else if(name == 'Fire Genasi') {
    rules.defineRule('magicNotes.reachToTheBlaze.1',
      'features.Reach To The Blaze', '?', null,
      'level', '=', 'source<3 ? "" : ", cast <i>Burning Hands</i> 1/long rest"'
    );
  } else if(name == 'Lotusden Halfling') {
    rules.defineRule('magicNotes.childOfTheWood.1',
      'features.Child Of The Wood', '?', null,
      'level', '=', 'source<3 ? "" : source<5 ? ", cast <i>Entangle</i> 1/long rest" : ", cast <i>Entangle</i> and <i>Spike Growth</i> 1/long rest"'
    );
  } else if(name == 'Pallid Elf') {
    rules.defineRule('magicNotes.blessingOfTheMoonWeaver.1',
      'features.Blessing Of The Moon Weaver', '?', null,
      'level', '=', 'source<3 ? "" : source<5 ? ", cast <i>Sleep</i> 1/long rest" : ", cast <i>Sleep</i> and <i>Invisibility</i> 1/long rest"'
    );
  } else if(name == 'Ravenite') {
    rules.defineRule('selectableFeatureCount.Ravenite',
      'race', '=', 'source == "Ravenite" ? 1 : null'
    );
  } else if(name == 'Tortle') {
    rules.defineRule('armorClass', 'combatNotes.naturalArmor', '=', '17');
    rules.defineRule
      ('combatNotes.dexterityArmorClassAdjustment', 'tortleLevel', '*', '0');
    SRD5E.weaponRules(rules, 'Claws', 0, ['Un'], '1d4', null);
    rules.defineRule('weapons.Claws', 'combatNotes.claws', '=', '1');
  } else if(name == 'Water Genasi') {
    rules.defineRule('magicNotes.callToTheWave.1',
      'features.Call To The Wave', '?', null,
      'level', '=', 'source<3 ? "" : ", cast <i>Destroy Water</i> 1/long rest"'
    );
  }
};

/* Returns an array of plugins upon which this one depends. */
Wildemount.getPlugins = function() {
  var result = [PHB5E, SRD5E];
  if(window.Tasha != null &&
     QuilvynUtils.getKeys(Wildemount.rules.getChoices('selectableFeatures'), /Peace Domain/).length > 0)
    result.unshift(Tasha);
  if(window.Volo != null &&
     (Volo.CHARACTER_RACES_IN_PLAY || Volo.MONSTROUS_RACES_IN_PLAY))
    result.unshift(Volo);
  if(window.Xanathar != null &&
     QuilvynUtils.getKeys(Wildemount.rules.getChoices('selectableFeatures'), /Forge Domain/).length > 0)
    result.unshift(Xanathar);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
Wildemount.ruleNotes = function() {
  return '' +
    '<h2>Wildemount Quilvyn Plugin Notes</h2>\n' +
    '<p>\n' +
    'Wildemount Quilvyn Plugin Version ' + Wildemount.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Races from the Wildemount rule book that are also defined in\n' +
    '    Volo\'s Guide to Monsters are available only if the Volo module is\n' +
    '    also selected. These races are Aasimar, Firbolg, Bugbear, Goblin,\n' +
    '    Hobgoblin, Kenku, Orc, and Tabaxi.\n' +
    '  </li><li>\n' +
    '    Quilvyn makes the Hollow One feature available as a special feat.\n' +
    '    To use it, add the line "* +1 Feat" to the character notes, then\n' +
    '    select Hollow One in the Feats pull-down.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Portions of Quilvyn\'s Wildemount rule set are unofficial Fan Content\n' +
    'permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. © Wizards ' +
    'of the Coast LLC.\n' +
    '</p><p>\n' +
    'Explorer\'s Guide to Wildemount © 2020 Wizards of the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
