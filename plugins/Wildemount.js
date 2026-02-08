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

Wildemount.VERSION = '2.4.2.0';

Wildemount.BACKGROUNDS_ADDED = {
  'Grinner':
    'Equipment=' +
      '"Fine Clothes","Disguise Kit","Musical Instrument","Gold Ring","15 GP" '+
    'Features=' +
      '"1:Skill Proficiency (Deception; Performance)",' +
      '"1:Tool Proficiency (Thieves\' Tools; Choose 1 from any Musical)",' +
      '"1:Ballad Of The Grinning Fool"',
  'Volstrucker Agent':
    'Equipment=' +
      '"Common Clothes","Black Cloak","Poisoner\'s Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception; Stealth)",' +
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
    'Note="Can obtain shelter for self and companions in a Menagerie Coast or Dwendallian Empire city"',
  'Shadow Network':
    'Section=feature Note="Can write magically to distant Volstrucker members"',

  // Feats
  'Hollow One':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Ageless, Cling To Life, Revenance, and Unsettling Presence features",' +
      '"Has returned from death"',

  // Races

  // Elf - Pallid
  'Blessing Of The Moon Weaver':
    'Section=magic ' +
    'Note="Knows the <i>Light</i> cantrip%{level<3?\'\':level<5?\' and can cast <i>Sleep</i> once per long rest\':\' and can cast <i>Sleep</i> and self <i>Invisibility</i> once per long rest\'}" ' +
    'SpellAbility=Wisdom ' +
    'Spells=Light,3:Sleep,5:Invisibility',
  'Incisive Sense':
    'Section=skill Note="Has advantage on Investigation and Insight"',
  'Pallid Elf Ability Adjustment':'Section=ability Note="+1 Wisdom"',
  // Elf - Sea
  'Child Of The Sea':
    'Section=ability Note="Has a 30\' swim Speed and can breathe water"',
  'Friend Of The Sea':
    'Section=skill Note="Can communicate simple ideas with swimming creatures"',
  'Sea Elf Ability Adjustment':'Section=ability Note="+1 Constitution"',
  'Sea Elf Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Light Crossbow; Net; Spear; Trident)"',

  // Halfling - Lotusden
  'Child Of The Wood':
    'Section=magic ' +
    'Note="Knows the <i>Druidcraft</i> cantrip%{level<3?\'\':level<5?\' and can cast <i>Entangle</i> once per long rest\':\' and can cast <i>Entangle<i> and <i>Spike Growth</i> once per long rest\'}" ' +
    'SpellAbility=Wisdom ' +
    'Spells=Druidcraft,3:Entangle,"5:Spike Growth"',
  'Lotusden Halfling Ability Adjustment':'Section=ability Note="+1 Wisdom"',
  'Timberwalk':
    'Section=ability,feature ' +
    'Note=' +
      '"Can move normally through nonmagical difficult undergrowth",' +
      '"Trackers suffer disadvantage"',

  // Aarakocra
  'Aarakocra Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Flight':
    'Section=ability ' +
    'Note="Has a 50\' fly Speed; medium or heavy armor negates"',
  'Talons':
    'Section=combat Note="Talons inflict 1d4+%{strengthModifier} slashing"',

  // Dragonborn - Draconblood
  // Darkvision as SRD5E
  'Draconblood Ability Adjustment':
    'Section=ability Note="+2 Intelligence/+1 Charisma"',
  'Forceful Presence':
    'Section=skill ' +
    'Note="Has advantage on Intimidation or Persuasion once per short rest"',
  // Dragonborn - Ravenite
  // Darkvision as SRD5E
  'Ravenite Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Vengeful Assault':
    'Section=combat ' +
    'Note="Can use a reaction to attack after taking damage once per short rest"',

  // Genasi
  'Genasi Ability Adjustment':'Section=ability Note="+2 Constitution"',
  // Genasi - Air
  'Air Genasi Ability Adjustment':'Section=ability Note="+1 Dexterity"',
  'Mingle With The Wind':
     'Section=magic ' +
     'Note="Can cast <i>Levitate</i> once per long rest" ' +
     'SpellAbility=Constitution ' +
     'Spells=Levitate',
  'Unending Breath':'Section=save Note="Can hold breath indefinitely"',
  // Genasi - Earth
  'Earth Genasi Ability Adjustment':'Section=ability Note="+1 Strength"',
  'Earth Walk':
    'Section=ability ' +
    'Note="Can move normally over difficult terrain made of earth and stone"',
  'Pass Without Trace':
    'Section=magic ' +
    'Note="Can cast <i>Pass Without Trace</i> once per long rest" ' +
    'SpellAbility=Constitution ' +
    'Spells="Pass Without Trace"',
  // Genasi - Fire
  // Darkvision as SRD5E
  'Fire Genasi Ability Adjustment':'Section=ability Note="+1 Intelligence"',
  'Fire Resistance':'Section=save Note="Has resistance to fire"',
  'Reach To The Blaze':
    'Section=magic ' +
    'Note="Knows the <i>Produce Flame</i> cantrip%{level<3?\'\':\' and can cast <i>Burning Hands</i> once per long rest\'}" ' +
    'SpellAbility=Constitution ' +
    'Spells="Produce Flame","3:Burning Hands"',
  // Genasi - Water
  'Acid Resistance':'Section=save Note="Has resistance to acid"',
  'Amphibious':'Section=ability Note="Can breathe water"',
  'Call To The Wave':
    'Section=magic ' +
    'Note="Knows the <i>Shape Water</i> cantrip%{level<3?\'\':\' and can cast <i>Create Or Destroy Water</i> once per long rest\'}" ' +
    'SpellAbility=Constitution ' +
    'Spells="Shape Water","3:Create Or Destroy Water"',
  'Swim':'Section=ability Note="Has a 30\' swim Speed"',
  'Water Genasi Ability Adjustment':'Section=ability Note="+1 Wisdom"',

  // Orc
  'Primal Intuition':
    'Section=feature ' +
    'Note="Skill Proficiency (Choose 2 from Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, Survival)"',

  // Tortle
  'Claws':
    'Section=combat Note="Claws inflict 1d4+%{strengthModifier} slashing"',
  'Hold Breath':'Section=ability Note="Can hold breath for 1 hr"',
  'Natural Armor':
    'Section=combat ' +
    'Note="Shell gives armor class 17; cannot wear additional armor"',
  'Shell Defense':
    'Section=combat ' +
    'Note="Withdrawal into shell gives +4 armor class and advantage on Strength and Constitution saves while inflicting prone, immobility, disadvantage on Dexterity saves, and loss of actions and reactions"',
  'Survival Instinct':'Section=skill Note="Skill Proficiency (Survival)"',
  'Tortle Ability Adjustment':'Section=ability Note="+2 Strength/+1 Wisdom"',

  // Feats
  'Ageless':'Section=save Note="Has immunity to aging"',
  'Cling To Life':
    'Section=combat ' +
    'Note="Regains 1 hit point from a successful death saving throw above 15"',
  'Revenance':'Section=feature Note="Detects as undead"',
  'Unsettling Presence':
    'Section=combat ' +
    'Note="R15\' Can inflict disadvantage on the next target save within 1 min once per long rest"',

  // Classes

  // Fighter - Echo Knight
  'Echo Avatar':
    'Section=magic ' +
    'Note="R1000\' Can see and hear through Manifest Echo for 10 min"',
  'Legion Of One':
    'Section=combat ' +
    'Note="Has a minimum 1 Unleash Incarnation use after initiative and can create 2 Manifest Echos simultaneously"',
  'Manifest Echo':
    'Section=combat ' +
    'Note="R30\' Can use a bonus action to create a copy of self (armor class %{14+proficiencyBonus}; 1 hit point; can move 30\') that can be used to exchange places as a bonus action and to make attacks and opportunity attacks"',
  'Reclaim Potential':
    'Section=combat ' +
    'Note="Can gain 2d6+%{constitutionModifier} temporary hit points when Manifest Echo is destroyed %{constitutionModifier>1?constitutionModifier+\' times\':\'once\'} per long rest"',
  'Shadow Martyr':
    'Section=combat ' +
    'Note="Can use a reaction to have Manifest Echo absorb an attack once per short rest"',
  'Unleash Incarnation':
    'Section=combat ' +
    'Note="Can make an extra attack through Manifest Echo %{constitutionModifier>1?constitutionModifier+\' times\':\'once\'} per long rest"',

  // Wizard - Chronurgy Magic
  'Arcane Abeyance':
    'Section=magic ' +
    'Note="Can store a spell of up to 4th level in a bead (armor class 15; 1 hit point) that can be used to cast the spell within 1 hr once per short rest"',
  'Chronal Shift':
    'Section=combat ' +
    'Note="R30\' Can use a reaction to force an attack, ability, or save reroll 2 times per long rest"',
  'Convergent Future':
    'Section=combat ' +
    'Note="R60\' Can suffer 1 level of exhaustion to dictate whether an attack, ability, or save roll succeeds; the exhaustion requires a long rest to remove"',
  'Momentary Stasis':
    'Section=magic ' +
    'Note="R60\' Can incapacitate a Large target for 1 rd (save Constitution neg) %{intelligenceModifier>1?intelligenceModifier+\' times\':\'once\'} per long rest"',
  'Temporal Awareness':
    'Section=combat Note="+%{intelligenceModifier} Initiative"',
  // Wizard - Graviturgy Magic
  'Adjust Density':
    'Section=magic ' +
    'Note="R30\' Can double or halve the weight of a %{levels.Wizard<10?\'Large\':\'Huge\'} target, giving -10 or +10 Speed and advantage or disadvantage on Strength, for concentration up to 1 min"',
  'Event Horizon':
    'Section=magic ' +
    'Note="30\' radius inflicts 2d10 HP force and immobility for 1 rd on foes (save Strength inflicts half HP and 1/3 Speed) for concentration up to 1 min once long rest; can spend level 3 spell slots for additional uses"',
  'Gravity Well':
    'Section=magic Note="Can move the target of a successful spell 5\'"',
  'Violent Attraction':
    'Section=combat ' +
    'Note="R60\' Can use a reaction to inflict +1d10 HP on a weapon target or +2d10 HP on a falling target %{intelligenceModifier>1?intelligenceModifier+\' times\':\'once\'} per long rest"'

};
Wildemount.FEATURES =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATURES, Wildemount.FEATURES_ADDED);
Wildemount.RACES_ADDED = {
  'Aarakocra':
    'Size=Medium ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Language (Common; Aarakocra; Auran)",' +
      '"1:Aarakocra Ability Adjustment","1:Flight","1:Talons"',
  // NOTE: Aasimar requires Volo
  'Air Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Genasi Ability Adjustment","1:Language (Common; Primordial)",' +
      '"1:Air Genasi Ability Adjustment","1:Mingle With The Wind",' +
      '"1:Unending Breath"',
  // NOTE: Bugbear requires Volo
  'Draconblood':SRD5E.RACES.Dragonborn
    .replace('Dragonborn Ability Adjustment', 'Draconblood Ability Adjustment')
    .replace('Damage Resistance', 'Forceful Presence')
    .replace('Features=', 'Features="1:Darkvision",'),
  'Earth Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Genasi Ability Adjustment","1:Language (Common; Primordial)",' +
      '"1:Earth Genasi Ability Adjustment","1:Earth Walk",' +
      '"1:Pass Without Trace"',
  // NOTE: Firbolg requires Volo
  'Fire Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Genasi Ability Adjustment","1:Language (Common; Primordial)",' +
      '"1:Darkvision","1:Fire Genasi Ability Adjustment","1:Fire Resistance",' +
      '"1:Reach To The Blaze"',
  // NOTE: Goblin requires Volo
  // NOTE: Goliath requires Volo
  // NOTE: Hobgoblin requires Volo
  // NOTE: Kenku requires Volo
  'Lotusden Halfling':SRD5E.RACES['Lightfoot Halfling']
    .replace('Lightfoot Halfling Ability Adjustment', 'Lotusden Halfling Ability Adjustment')
    .replace('Naturally Stealthy', 'Child Of The Wood')
    .replace('Features=', 'Features="1:Timberwalk",'),
  // NOTE: Orc requires Volo
  'Pallid Elf':SRD5E.RACES['High Elf']
    .replace('High Elf Ability Adjustment', 'Pallid Elf Ability Adjustment')
    .replace('Elf Weapon Training', 'Incisive Sense')
    .replace('Cantrip (High Elf)', 'Blessing Of The Moon Weaver')
    .replace(',"1:Extra Language"', ''),
  'Ravenite':SRD5E.RACES.Dragonborn
    .replace('Dragonborn Ability Adjustment', 'Ravenite Ability Adjustment')
    .replace('Damage Resistance', 'Vengeful Assault')
    .replace('Features=', 'Features="1:Darkvision",'),
  'Sea Elf':SRD5E.RACES['High Elf']
    .replace('High Elf Ability Adjustment', 'Sea Elf Ability Adjustment')
    .replace('Elf Weapon Training', 'Sea Elf Training')
    .replace('Cantrip (High Elf)', 'Child Of The Sea')
    .replace('Extra Language', 'Friend Of The Sea')
    .replace('Common', 'Aquan; Common'),
  // NOTE: Tabaxi requires Volo
  'Tortle':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"Language (Common; Aquan)",' +
      '"1:Claws","1:Hold Breath","1:Natural Armor","1:Shell Defense",' +
      '"1:Survival Instinct","1:Tortle Ability Adjustment"',
  'Water Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Genasi Ability Adjustment","1:Language (Common; Primordial)",' +
      '"1:Acid Resistance","1:Amphibious","1:Call To The Wave","1:Swim",' +
      '"1:Water Genasi Ability Adjustment"'
};
if(window.Volo != null) {
  Wildemount.RACES_ADDED.Orc =
    Volo.MONSTROUS_RACES.Orc.replace('Menacing', 'Primal Intuition');
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
    'Description="R120\' Can cast as a reaction to cause target to disappear for 1 rd, negating attack or spell cast (Wisdom neg)"',
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
    'Description="Self can move touched 5 lb object to and from an extradimensional space for conc up to 1 hr"'
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
    '  Hobgoblin, Goliath, Kenku, Orc, and Tabaxi.\n' +
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
