/*
Copyright 2023, James J. Hayes

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
 * (BACKGROUNDS, SPELLS, etc.) can be manipulated to modify the choices.
 */
function Wildemount() {

  if(window.PHB5E == null) {
    alert('The Wildemount module requires use of the PHB5E module');
    return;
  }

  let rules = new QuilvynRules('Wildemount', Wildemount.VERSION);
  Wildemount.rules = rules;
  rules.plugin = Wildemount;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = Wildemount.choiceRules;
  rules.removeChoice = SRD5E.removeChoice;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = Wildemount.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E.getChoices;
  rules.ruleNotes = Wildemount.ruleNotes;

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
  SRD5E.magicRules(rules, PHB5E.SCHOOLS, Wildemount.SPELLS);
  SRD5E.identityRules(
    rules, PHB5E.ALIGNMENTS, Wildemount.BACKGROUNDS, Wildemount.CLASSES,
    Wildemount.DEITIES, {}, Wildemount.RACES
  );
  SRD5E.talentRules
    (rules, Wildemount.FEATS, Wildemount.FEATURES, PHB5E.GOODIES,
     PHB5E.LANGUAGES, PHB5E.SKILLS, PHB5E.TOOLS);

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

Wildemount.VERSION = '2.4.1.0';

Wildemount.BACKGROUNDS_ADDED = {
  'Grinner':
    'Equipment=' +
      '"Fine Clothes","Disguise Kit","Musical Instrument","Gold Ring","15 GP" '+
    'Features=' +
      '"1:Skill Proficiency (Deception/Performance)",' +
      '"1:Tool Proficiency (Thieves\' Tools/Choose 1 from any Musical)",' +
      '"1:Ballad Of The Grinning Fool"',
  'Volstrucker Agent':
    'Equipment=' +
      '"Common Clothes","Black Cloak","Poisoner\'s Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Stealth)",' +
      '"1:Tool Proficiency (Poisoner\'s Kit)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Shadow Network"'
};
Wildemount.BACKGROUNDS =
  Object.assign({}, (window.PHB5E||window.SRD5E).BACKGROUNDS, Wildemount.BACKGROUNDS_ADDED);
Wildemount.CLASSES_FEATURES_ADDED = {
  'Fighter':
    '"features.Echo Knight ? 3:Manifest Echo",' +
    '"features.Echo Knight ? 3:Unleash Incarnation",' +
    '"features.Echo Knight ? 7:Echo Avatar",' +
    '"features.Echo Knight ? 10:Shadow Martyr",' +
    '"features.Echo Knight ? 15:Reclaim Potential",' +
    '"features.Echo Knight ? 18:Legion Of One"',
  'Wizard':
    '"features.Chronurgy Magic ? 2:Chronal Shift",' +
    '"features.Chronurgy Magic ? 2:Temporal Awareness",' +
    '"features.Chronurgy Magic ? 6:Momentary Stasis",' +
    '"features.Chronurgy Magic ? 10:Arcane Abeyance",' +
    '"features.Chronurgy Magic ? 14:Convergent Future",' +
    '"features.Graviturgy Magic ? 2:Adjust Density",' +
    '"features.Graviturgy Magic ? 6:Gravity Well",' +
    '"features.Graviturgy Magic ? 10:Violent Attraction",' +
    '"features.Graviturgy Magic ? 14:Event Horizon"'
};
Wildemount.CLASSES_SELECTABLES_ADDED = {
  'Fighter':
    '"3:Echo Knight:Martial Archetype"',
  'Wizard':
    '"2:Chronurgy Magic:Arcane Tradition",' +
    '"2:Graviturgy Magic:Arcane Tradition"'
};
Wildemount.CLASSES = Object.assign({}, PHB5E.CLASSES);
for(let c in Wildemount.CLASSES_FEATURES_ADDED)
  Wildemount.CLASSES[c] =
    Wildemount.CLASSES[c].replace('Features=', 'Features=' + Wildemount.CLASSES_FEATURES_ADDED[c] + ',');
for(let c in Wildemount.CLASSES_SELECTABLES_ADDED)
  Wildemount.CLASSES[c] =
    Wildemount.CLASSES[c].replace('Selectables=', 'Selectables=' + Wildemount.CLASSES_SELECTABLES_ADDED[c] + ',');
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
Wildemount.FEATS =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATS, Wildemount.FEATS_ADDED);
Wildemount.FEATURES_ADDED = {

  // Backgrounds
  'Ballad Of The Grinning Fool':
    'Section=feature ' +
    'Note="May obtain shelter for self and companions in a Menagerie Coast or Dwendallian Empire city"',
  'Shadow Network':
    'Section=feature Note="May write magically to distant Volstrucker members"',

  // Feats
  'Hollow One':
    'Section=feature ' +
    'Note="Has returned from death/Has Ageless, Cling To Life, Revenance, and Unsettling Presence features"',

  // Paths
  'Adjust Density':
    'Section=magic ' +
    'Note="R30\' May dbl or halve the weight of a %{levels.Wizard<10?\'Large\':\'Huge\'} target (-10/+10 Speed, Adv/Disadv on Strength) for conc up to 1 min"',
  'Arcane Abeyance':
    'Section=magic ' +
    'Note="May store a level 1 - 4 spell in a bead (AC 15; HP 1) for 1 hr 1/short rest"',
  'Chronal Shift':
    'Section=combat ' +
    'Note="R30\' May use Reaction to force an attack, ability, or save reroll 2/long rest"',
  'Convergent Future':
    'Section=combat ' +
    'Note="R60\' May suffer 1 level of exhaustion to dictate whether an attack, ability, or save roll succeeds; exhaustion requires a long rest to remove"',
  'Echo Avatar':
    'Section=magic ' +
    'Note="R1000\' May see and hear via Manifest Echo for 10 min"',
  'Event Horizon':
    'Section=magic ' +
    'Note="30\' radius inflicts 2d10 HP force and immobility for 1 rd on foes (Strength half HP and one-third Speed) for conc up to 1 min 1/long rest (level 3 spell slot refreshes)"',
  'Gravity Well':
    'Section=magic Note="May move the target of a successful spell 5\'"',
  'Legion Of One':
    'Section=combat ' +
    'Note="Has a minimum 1 Unleash Incarnation use after initiative/May create 2 Manifest Echos simultaneously"',
  'Manifest Echo':
    'Section=combat ' +
    'Note="R30\' May use a bonus action to create a copy of self (AC %{14+proficiencyBonus}, HP 1, MV 30\'); may swap places and make remote attacks and OAs"',
  'Momentary Stasis':
    'Section=magic ' +
    'Note="R60\' May incapacitate a Large target for 1 rd (Constitution neg) %{intelligenceModifier>?1}/long rest"',
  'Reclaim Potential':
    'Section=combat ' +
    'Note="May gain 2d6+%{constitutionModifier} temporary HP when Manifest Echo is destroyed %{constitutionModifier>?1}/long rest"',
  'Shadow Martyr':
    'Section=combat ' +
    'Note="May use Reaction to have Manifest Echo absorb an attack 1/short rest"',
  'Temporal Awareness':
    'Section=combat Note="+%{intelligenceModifier} Initiative"',
  'Unleash Incarnation':
    'Section=combat ' +
    'Note="May make an extra attack through Manifest Echo %{constitutionModifier>?1}/long rest"',
  'Violent Attraction':
    'Section=combat ' +
    'Note="R60\' May use Reaction to inflict +1d10 HP on a weapon target or +2d10 HP on a falling target %{intelligenceModifier>?1}/long rest"',

  // Races
  'Aarakocra Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Acid Resistance':'Section=save Note="Resistance to acid damage"',
  'Ageless':'Section=feature Note="Immune to aging"',
  'Air Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Dexterity"',
  'Amphibious':'Section=feature Note="May breathe water"',
  'Blessing Of The Moon Weaver':
    'Section=magic ' +
    'Note="Knows <i>Light</i> cantrip%{level<3?\'\':level<5?\', may cast <i>Sleep</i> 1/long rest\':\', may cast <i>Sleep</i> and self <i>Invisibility</i> 1/long rest\'}" ' +
    'SpellAbility=Wisdom ' +
    'Spells=Light,3:Sleep,5:Invisibility',
  'Call To The Wave':
    'Section=magic ' +
    'Note="Knows <i>Shape Water</i> cantrip%{level<3?\'\':\', cast <i>Destroy Water</i> 1/long rest\'}" ' +
    'SpellAbility=Constitution ' +
    'Spells="Shape Water","3:Create Or Destroy Water"',
  'Child Of The Sea':'Section=ability Note="30\' swim speed/May breathe water"',
  'Child Of The Wood':
    'Section=magic ' +
    'Note="Knows <i>Druidcraft</i> cantrip%{level<3?\'\':level<5?\', may cast <i>Entangle</i> 1/long rest\':\', may cast <i>Entangle<i> and <i>Spike Growth</i> 1/long rest\'}" ' +
    'SpellAbility=Wisdom ' +
    'Spells=Druidcraft,3:Entangle,"5:Spike Growth"',
  'Claws':'Section=combat Note="Claws are a natural weapon"',
  'Cling To Life':
    'Section=combat ' +
    'Note="Regains 1 HP from a successful death saving throw above 15"',
  'Draconblood Ability Adjustment':
    'Section=ability Note="+2 Intelligence/+1 Charisma"',
  'Earth Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Strength"',
  'Earth Walk':
    'Section=ability Note="May move normally over difficult earth and stone"',
  'Fire Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Intelligence"',
  'Fire Resistance':'Section=save Note="Resistance to fire damage"',
  'Flight':'Section=ability Note="50\' fly speed"',
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
     'Section=magic ' +
     'Note="May cast <i>Levitate</i> 1/long rest" ' +
     'SpellAbility=Constitution ' +
     'Spells=Levitate',
  'Mountain Born':
    'Section=feature ' +
    'Note="Acclimated to high elevations and cold environments"',
  'Natural Armor':'Section=combat Note="Shell gives AC 17; cannot wear armor"',
  'Natural Athlete':'Section=skill Note="Skill Proficiency (Athletics)"',
  'Pallid Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Pass Without Trace':
    'Section=magic ' +
    'Note="May cast <i>Pass Without Trace</i> 1/long rest" ' +
    'SpellAbility=Constitution ' +
    'Spells="Pass Without Trace"',
  'Primal Intuition':
    'Section=feature ' +
    'Note="Skill Proficiency (Choose 2 from Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, Survival)"',
  'Powerful Build':'Section=ability Note="x2 Carry/x2 Lift"',
  'Ravenite Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Reach To The Blaze':
    'Section=magic ' +
    'Note="Knows <i>Produce Flame</i> cantrip%{level<3?\'\':\', may cast <i>Burning Hands</i> 1/long rest\'}" ' +
    'SpellAbility=Constitution ' +
    'Spells="Produce Flame","3:Burning Hands"',
  'Revenance':'Section=feature Note="Detects as undead"',
  'Sea Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Sea Elf Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Light Crossbow/Net/Spear/Trident)"',
  'Shell Defense':
    'Section=combat ' +
    'Note="Withdrawal into shell gives +4 AC and Adv on Strength and Constitution saves; inflicts prone, immobility, Disadv on Dexterity saves, and no actions or reactions"',
  'Survival Instinct':'Section=skill Note="Skill Proficiency (Survival)"',
  "Stone's Endurance":
    'Section=combat ' +
    'Note="May reduce damage to self by 1d12+%{constitutionModifier} 1/short rest"',
  'Swim':'Section=ability Note="30\' swim speed"',
  'Talons':'Section=combat Note="Talons are a natural weapon"',
  'Timberwalk':
    'Section=ability,feature ' +
    'Note=' +
      '"May move normally through difficult undergrowth",' +
      '"Trackers suffer Disadv"',
  'Tortle Ability Adjustment':'Section=ability Note="+2 Strength/+1 Wisdom"',
  'Unending Breath':'Section=feature Note="May hold breath indefinitely"',
  'Unsettling Presence':
    'Section=combat ' +
    'Note="R15\' May inflict Disadv on next target save for 1 min 1/long rest"',
  'Vengeful Assault':
    'Section=combat ' +
    'Note="May use Reaction to attack after taking damage 1/short rest"',
  'Water Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Wisdom"'

};
Wildemount.FEATURES =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATURES, Wildemount.FEATURES_ADDED);
Wildemount.RACES_ADDED = {
  'Aarakocra':
    'Features=' +
      '"Language (Common/Aarakocra/Auran)",' +
      '"Aarakocra Ability Adjustment",Flight,Slow,Talons',
  'Air Genasi':
    'Features=' +
      '"Language (Common/Primordial)",' +
      '"Air Genasi Ability Adjustment","Mingle With The Wind",' +
      '"Unending Breath"',
  'Draconblood':SRD5E.RACES.Dragonborn
    .replace('Dragonborn Ability Adjustment', 'Draconblood Ability Adjustment')
    .replace('Damage Resistance', 'Forceful Presence')
    .replace('Features=', 'Features=Darkvision,'),
  'Earth Genasi':
    'Features=' +
      '"Language (Common/Primordial)",' +
      '"Earth Genasi Ability Adjustment","Earth Walk","Pass Without Trace"',
  'Fire Genasi':
    'Features=' +
      '"Language (Common/Primordial)",' +
      'Darkvision,"Fire Genasi Ability Adjustment","Fire Resistance",' +
      '"Reach To The Blaze"',
  'Goliath':
    'Features=' +
      '"Language (Common/Giant)",' +
      '"Goliath Ability Adjustment","Mountain Born","Natural Athlete",' +
      '"Powerful Build","Stone\'s Endurance"',
  'Lotusden Halfling':
    'Features=' +
      '"Language (Common/Halfling)",' +
      'Brave,"Child Of The Wood","Halfling Nimbleness",' +
      '"Lotusden Halfling Ability Adjustment","Lucky (Halfling)",Slow,Small,' +
      'Timberwalk',
  'Pallid Elf':
    'Features=' +
      '"Language (Common/Elvish)",' +
      '"Blessing Of The Moon Weaver",Darkvision,"Fey Ancestry",' +
      '"Incisive Sense","Keen Senses","Pallid Elf Ability Adjustment",Trance',
  'Ravenite':SRD5E.RACES.Dragonborn
    .replace('Dragonborn Ability Adjustment', 'Ravenite Ability Adjustment')
    .replace('Damage Resistance', 'Vengeful Assault')
    .replace('Features=', 'Features=Darkvision,'),
  'Sea Elf':
    'Features=' +
      '"Language (Common/Aquan/Elvish)",' +
      '"Child Of The Sea",Darkvision,"Fey Ancestry","Friend Of The Sea",' +
      '"Keen Senses","Sea Elf Ability Adjustment","Sea Elf Training",Trance',
  'Tortle':
    'Features=' +
      '"Language (Common/Aquan)",' +
      'Claws,"Hold Breath","Natural Armor","Shell Defense",' +
      '"Survival Instinct","Tortle Ability Adjustment"',
  'Water Genasi':
    'Features=' +
      '"Language (Common/Primordial)",' +
      '"Acid Resistance",Amphibious,"Call To The Wave",Swim,' +
      '"Water Genasi Ability Adjustment"'
};
if(window.Volo != null) {
  Wildemount.RACES_ADDED.Orc =
    Volo.MONSTROUS_RACES.Orc.replace('Menacing', '"Primal Intuition"');
}
Wildemount.RACES = Object.assign({}, (window.PHB5E||window.SRD5E).RACES, Wildemount.RACES_ADDED);
Wildemount.SPELLS_ADDED = {
  'Dark Star':
    'School=Evocation ' +
    'Level=W8 ' +
    'Description="R150\' 40\' radius sphere inflicts 8d10 HP force (Constitution half), disintegrates dead, and negates sight and sound for conc up to 1 min"',
  "Fortune's Favor":
    'School=Divination ' +
    'Level=W2 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description="R60\' Target gains Adv on 1 attack, ability, or save, or foe Disadv on 1 attack, within 1 hr"',
  'Gift Of Alacrity':
    'School=Divination ' +
    'Level=W1 ' +
    'Description="Willing touched gains +1d8 initiative for 8 hr"',
  'Gravity Fissure':
    'School=Evocation ' +
    'Level=W6 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description="5\'x100\' line inflicts 8d8 HP force (Constitution half) and pulls and inflicts 8d8 HP force on creatures w/in 10\' (Constitution neg)"',
  'Gravity Sinkhole':
    'School=Evocation ' +
    'Level=W4 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description="R120\' 20\' radius inflicts 5d10 HP force and pulls to center (Constitution half HP only)"',
  'Immovable Object':
    'School=Transmutation ' +
    'Level=W2 ' +
    'AtHigherLevels="increases Strength DC +5/+10, increases object support to 8,000/20,000 lb, and extends duration to 24 hr/permanent at level 4/6" ' +
    'Description="Touched 10 lb object movable only by specified creatures (Strength move 10\') and can support 4000 lb for 1 hr"',
  'Magnify Gravity':
    'School=Transmutation ' +
    'Level=W1 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description="R60\' 10\' radius inflicts 2d8 HP force and half speed (Constitution half HP only) for 1 rd"',
  'Pulse Wave':
    'School=Evocation ' +
    'Level=W3 ' +
    'AtHigherLevels="inflicts +1d6 HP and moves +5\'" ' +
    'Description="30\' cone inflicts 6d6 HP force and pulls or pushes 15\' (Constitution half HP only)"',
  'Ravenous Void':
    'School=Evocation ' +
    'Level=W9 ' +
    'Description="R1000\' 20\' radius inflicts 5d10 HP force and restrains, destroys dead and nonmagical objects, and creates 120\' radius difficult terrain that pulls to center for conc up to 1 min"',
  'Reality Break':
    'School=Conjuration ' +
    'Level=W8 ' +
    'Description="R60\' Target loses reactions and suffers random effects (Wisdom ends) for conc up to 1 min"',
  'Sapping Sting':
    'School=Necromancy ' +
    'Level=W0 ' +
    'Description="R30\' Target suffers %{(level+7)//6}d4 HP and knocked prone (Constitution neg)"',
  'Shape Water': // Copied from Xanathar's
    'School=Transmutation ' +
    'Level=D0,S0,W0 ' +
    'Description="R30\' 5\' cu water moves 5\' or forms animated shapes, changes color or opacity, or freezes for 1 hr"',
  'Temporal Shunt':
    'School=Transmutation ' +
    'Level=W5 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description="R120\' May cast as a reaction to cause target to disappear for 1 rd, negating attack or spell cast (Wisdom neg)"',
  'Tether Essence':
    'School=Necromancy ' +
    'Level=W7 ' +
    'Description="R60\' Two targets lose and gain HP identically for conc up to 1 hr or until 0 HP (Constitution neg, Disadv if w/in 30\')"',
  'Time Ravage':
    'School=Necromancy ' +
    'Level=W9 ' +
    'Description="R90\' Target suffers 10d12 HP necrotic and aging to near-death (Constitution half HP only)"',
  'Wristpocket':
    'School=Conjuration ' +
    'Level=W2 ' +
    'Description="Self may move touched 5 lb object to and from an extradimensional space for conc up to 1 hr"'
};
Wildemount.SPELLS =
  Object.assign({}, (window.PHB5E||window.SRD5E).SPELLS, Wildemount.SPELLS_ADDED);

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Wildemount.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'Feat')
    Wildemount.featRulesExtra(rules, name);
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
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Wildemount.raceRulesExtra = function(rules, name) {
  if(name == 'Aarakocra') {
    SRD5E.weaponRules(rules, 'Talons', 'Unarmed', [], '1d4', null);
    rules.defineRule('weapons.Talons', 'combatNotes.talons', '=', '1');
  } else if(name == 'Draconblood') {
    rules.defineRule('selectableFeatureCount.Draconblood',
      'race', '=', 'source == "Draconblood" ? 1 : null'
    );
  } else if(name == 'Ravenite') {
    rules.defineRule('selectableFeatureCount.Ravenite',
      'race', '=', 'source == "Ravenite" ? 1 : null'
    );
  } else if(name == 'Tortle') {
    rules.defineRule('armorClass', 'combatNotes.naturalArmor', '=', '17');
    rules.defineRule
      ('combatNotes.dexterityArmorClassAdjustment', 'tortleLevel', '*', '0');
    SRD5E.weaponRules(rules, 'Claws', 'Unarmed', [], '1d4', null);
    rules.defineRule('weapons.Claws', 'combatNotes.claws', '=', '1');
  }
};

/* Returns an array of plugins upon which this one depends. */
Wildemount.getPlugins = function() {
  let result = [PHB5E, SRD5E];
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
    '  Races from the Wildemount rule book that are also defined in' +
    '  Volo\'s Guide to Monsters are available only if the Volo module is' +
    '  also selected. These races are Aasimar, Firbolg, Bugbear, Goblin,' +
    '  Hobgoblin, Kenku, Orc, and Tabaxi.\n' +
    '  </li><li>\n' +
    '  Quilvyn makes the Hollow One feature available as a special feat.' +
    '  To use it, add the line "* +1 Feat" to the character notes, then' +
    '  select Hollow One in the Feats pull-down.\n' +
    '  </li><li>\n' +
    '  The Wildemount rule set allows you to add homebrew choices for' +
    '  all of the same types discussed in the <a href="plugins/homebrew-srd5e.html">SRD 5E Homebrew Examples document</a>.' +
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
