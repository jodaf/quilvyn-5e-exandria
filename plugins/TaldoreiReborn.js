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
 * This module loads the rules from the 5E Taldorei Reborn campaign setting
 * source book. The TaldoreiReborn function contains methods that load rules
 * for particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the rules. The constant fields of TaldoreiReborn
 * (BACKGROUNDS, FEATURES, etc.) can be manipulated to modify the choices.
 */
function TaldoreiReborn() {

  if(window.PHB5E == null) {
    alert('The TaldoreiReborn module requires use of the PHB5E module');
    return;
  }

  let rules = new QuilvynRules('Taldorei Reborn', TaldoreiReborn.VERSION);
  TaldoreiReborn.rules = rules;
  rules.plugin = TaldoreiReborn;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = TaldoreiReborn.choiceRules;
  rules.removeChoice = SRD5E.removeChoice;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = TaldoreiReborn.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E.getChoices;
  rules.ruleNotes = TaldoreiReborn.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  SRD5E.abilityRules(rules, SRD5E.ABILITIES);
  SRD5E.combatRules(rules, PHB5E.ARMORS, PHB5E.SHIELDS, PHB5E.WEAPONS);
  SRD5E.magicRules(rules, PHB5E.SCHOOLS, TaldoreiReborn.SPELLS);
  SRD5E.identityRules(
    rules, PHB5E.ALIGNMENTS, TaldoreiReborn.BACKGROUNDS, TaldoreiReborn.CLASSES,
    TaldoreiReborn.DEITIES, PHB5E.RACES
  );
  SRD5E.talentRules
    (rules, TaldoreiReborn.FEATS, TaldoreiReborn.FEATURES, PHB5E.GOODIES,
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

TaldoreiReborn.VERSION = '2.4.3.0';

TaldoreiReborn.BACKGROUNDS_ADDED = {
  'Ashari': // ref Taldorei
    'Equipment=' +
      '"Traveler\'s Clothes","Herbalism Kit","Staff","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Nature; Choose 1 from Arcana, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Language (Primordial)","1:Elemental Harmony"',
  'Clasp Member': // ref Taldorei
    'Equipment=' +
      '"Common Clothes","Tool Set","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception; Choose 1 from Sleight Of Hand, Stealth)",' +
      '"1:Tool Proficiency (Choose 1 from Disguise Kit, Forgery Kit, Thieves\' Tools)",' +
      '"1:A Favor In Turn","1:Thieves\' Cant"',
  'Lyceum Scholar': // ref Taldorei
    'Equipment=' +
      '"Fine Clothes","Student Uniform","Writing Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Persuasion)",' +
      '"1:Language (Choose 2 from any)","1:Academic Requisition"',
  'Reformed Cultist': // ref Taldorei
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception; Religion)",' +
      '"1:Language (Choose 1 from any)","1:Fell Teachings"',
  'Whitestone Rifle Corps':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Athletics, Perception, Survival)",' +
      '"1:Weapon Proficiency (Firearms)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Legacy Of Secrecy","1:Rifle Corps Relationship"'
};
TaldoreiReborn.BACKGROUNDS =
  Object.assign({}, (window.PHB5E||window.SRD5E).BACKGROUNDS, TaldoreiReborn.BACKGROUNDS_ADDED);
TaldoreiReborn.CLASSES_FEATURES_ADDED = {
  'Barbarian':
    '"features.Path Of The Juggernaut ? 3:Thunderous Blows",' +
    '"features.Path Of The Juggernaut ? 3:Spirit Of The Mountain",' +
    '"features.Path Of The Juggernaut ? 6:Demolishing Might",' +
    '"features.Path Of The Juggernaut ? 6:Resolute Stance",' +
    '"features.Path Of The Juggernaut ? 10:Hurricane Strike",' +
    '"features.Path Of The Juggernaut ? 14:Unstoppable"',
  'Bard':
    '"features.College Of Tragedy ? 3:Poetry In Misery",' +
    '"features.College Of Tragedy ? 3:Sorrowful Fate",' +
    '"features.College Of Tragedy ? 6:Tale Of Hubris",' +
    '"features.College Of Tragedy ? 6:Impending Misfortune",' +
    '"features.College Of Tragedy ? 14:Nimbus Of Pathos"',
  'Cleric':
    '"features.Blood Domain ? 1:Blood Domain Spells",' +
    '"features.Blood Domain ? 1:Bloodletting Focus",' +
    '"features.Blood Domain ? 1:Bonus Proficiencies (Blood Domain)",' +
    '"features.Blood Domain ? 2:Crimson Bond",' +
    '"features.Blood Domain ? 6:Blood Puppet",' +
    '"features.Blood Domain ? 6:Sanguine Recall",' +
    '"clericHasDivineStrike ? 8:Divine Strike",' +
    '"features.Blood Domain ? 17:Vascular Corruption Aura",' +
    '"features.Moon Domain ? 1:Clarity Of Catha",' +
    '"features.Moon Domain ? 1:Moon Domain Spells",' +
    '"features.Moon Domain ? 2:Blessing Of The Full Moon",' +
    '"features.Moon Domain ? 6:Mind Of Two Moons",' +
    '"features.Moon Domain ? 8:Empowered Cantrips",' +
    '"features.Moon Domain ? 17:Eclipse Of Ill Omen"',
  'Druid':
    '"features.Circle Of The Blighted ? 2:Defile Ground",' +
    '"features.Circle Of The Blighted ? 2:Blighted Shape",' +
    '"features.Circle Of The Blighted ? 6:Call Of The Shadowseeds",' +
    '"features.Circle Of The Blighted ? 10:Foul Conjuration",' +
    '"features.Circle Of The Blighted ? 14:Incarnation Of Corruption"',
  'Monk':
    '"features.Way Of The Cobalt Soul ? 3:Extract Aspects",' +
    '"features.Way Of The Cobalt Soul ? 6:Extort Truth",' +
    '"features.Way Of The Cobalt Soul ? 6:Mystical Erudition",' +
    '"features.Way Of The Cobalt Soul ? 11:Mind Of Mercury",' +
    '"features.Way Of The Cobalt Soul ? 17:Debilitating Barrage"',
  'Paladin':
    '"features.Oath Of The Open Sea ? 3:Fury Of The Tides",' +
    '"features.Oath Of The Open Sea ? 3:Marine Layer",' +
    '"features.Oath Of The Open Sea ? 3:Oath Of The Open Sea Spells",' +
    '"features.Oath Of The Open Sea ? 7:Aura Of Liberation",' +
    '"features.Oath Of The Open Sea ? 15:Stormy Waters",' +
    '"features.Oath Of The Open Sea ? 20:Mythic Swashbuckler"',
  'Sorcerer':
    '"features.Runechild ? 1:Essence Runes",' +
    '"features.Runechild ? 1:Glyph Of Aegis",' +
    '"features.Runechild ? 1:Runic Magic",' +
    '"features.Runechild ? 6:Manifest Inscriptions",' +
    '"features.Runechild ? 6:Sigilic Augmentation",' +
    '"features.Runechild ? 14:Runic Torrent",' +
    '"features.Runechild ? 18:Arcane Exemplar"',
  'Wizard':
    '"features.Blood Magic ? 2:Blood Channeling",' +
    '"features.Blood Magic ? 2:Sanguine Burst",' +
    '"features.Blood Magic ? 6:Bond Of Mutual Suffering",' +
    '"features.Blood Magic ? 10:Glyph Of Hemorrhaging",' +
    '"features.Blood Magic ? 14:Thicker Than Water"'
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
TaldoreiReborn.CLASSES =
  Object.assign({}, (window.PHB5E||window.SRD5E).CLASSES);
for(let c in TaldoreiReborn.CLASSES_FEATURES_ADDED)
  TaldoreiReborn.CLASSES[c] =
    TaldoreiReborn.CLASSES[c].replace('Features=', 'Features=' + TaldoreiReborn.CLASSES_FEATURES_ADDED[c] + ',');
for(let c in TaldoreiReborn.CLASSES_SELECTABLES_ADDED)
  TaldoreiReborn.CLASSES[c] =
    TaldoreiReborn.CLASSES[c].replace('Selectables=', 'Selectables=' + TaldoreiReborn.CLASSES_SELECTABLES_ADDED[c] + ',');
TaldoreiReborn.DEITIES = {
  'The Changebringer':'Alignment="Chaotic Good" Domain=Moon,Nature,Trickery',
  'The Platinum Dragon':'Alignment="Lawful Good" Domain=Life,Order,War',
  'The Arch Heart':'Alignment="Chaotic Good" Domain=Arcana,Light,Nature',
  'The Lawbearer':'Alignment="Lawful Neutral" Domain=Knowledge,Order',
  'The Knowing Mentor':'Alignment=Neutral Domain=Arcana,Knowledge,Twilight',
  'The Stormlord':'Alignment="Chaotic Neutral" Domain=Tempest,War',
  'The Wildmother':'Alignment=Neutral Domain=Life,Nature,Tempest',
  'The All-Hammer':'Alignment="Lawful Good" Domain=Forge,Knowledge,War',
  'The Dawnfather':'Alignment="Neutral Good" Domain=Life,Light,Nature',
  'The Everlight':'Alignment="Neutral Good" Domain=Life,Light,Peace',
  'The Matron Of Ravens':
    'Alignment="Lawful Neutral" Domain=Death,Grave,Twilight,Blood',
  'The Moonweaver':'Alignment="Chaotic Good" Domain=Arcana,Moon,Twilight',

  'The Lord Of The Hells':'Alignment="Lawful Evil" Domain=Order,Trickery,War',
  'The Strife Emperor':'Alignment="Lawful Evil" Domain=Forge,Order,War',
  'The Ruiner':'Alignment="Chaotic Evil" Domain=Death,Tempest,War,Blood',
  'The Spider Queen':'Alignment="Chaotic Evil" Domain=Knowledge,Trickery',
  'The Chained Oblivion':'Alignment="Chaotic Evil" Domain=Death,Grave,Trickery',
  'The Scaled Tyrant':'Alignment="Lawful Evil" Domain=Order,Trickery,War',
  'The Crawling King':'Alignment="Neutral Evil" Domain=Death,Trickery',
  'The Whispered One':'Alignment="Neutral Evil" Domain=Arcana,Death,Knowledge',
  'The Cloaked Serpent':'Alignment="Chaotic Evil" Domain=Nature,Trickery'
};
TaldoreiReborn.FEATS_ADDED = {
  'Cruel':'', // ref Taldorei
  'Flash Recall':
    'Require="features.Spellcasting || features.Pact Magic"', // ref Taldorei
  "Fortune's Grace":'Category=Special',
  'Mystic Conflux':'', // ref Taldorei
  'Remarkable Recovery':'',
  'Spelldriver': // ref Taldorei
    'Require="level >= 11","features.Spellcasting || features.Pact Magic"',
  'Thrown Arms Master':'', // ref Taldorei
  'Vital Sacrifice':''
};
TaldoreiReborn.FEATS =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATS, TaldoreiReborn.FEATS_ADDED);
TaldoreiReborn.FEATURES_ADDED = {

  // Class

  // Barbarian - Path Of The Juggernaut, ref Taldorei
  'Demolishing Might':
    'Section=combat ' +
    'Note="Melee attacks inflict double damage vs. objects and +1d8 HP vs. constructs"',
  'Hurricane Strike':
    'Section=combat ' +
    'Note="Can leap after pushing a foe to knock it prone (save DC %{8 + proficiencyBonus + strengthModifier} Strength negates), and pushing a foe allows an ally adjacent to it to use a reaction for a melee attack"',
  'Resolute Stance':
    'Section=combat ' +
    'Note="Can suffer disadvantage on weapon attacks to gain immunity to grappling and inflict disadvantage on foe attacks"',
  'Spirit Of The Mountain':
    'Section=combat ' +
    'Note="Cannot be knocked prone or forced to move along the ground during rage"',
  'Thunderous Blows':
    'Section=combat ' +
    'Note="Can push a foe %{levels.Barbarian<10?5:10}\' with a successful attack (save Huge foe DC %{8+proficiencyBonus+strengthModifier} Strength negates)"',
  'Unstoppable':
    'Section=combat ' +
    'Note="Cannot be slowed, frightened, knocked prone, paralyzed, or stunned during rage"',

  // Bard - College Of Tragedy
  'Impending Misfortune':
    'Section=combat ' +
    'Note="Can gain +10 on an attack or save, then suffer -10 on the next attack or save, once per short rest"',
  'Nimbus Of Pathos':
    'Section=magic ' +
    'Note="Willing touched gains +4 Armor Class, advantage on attacks and saves, and attacks and spells that inflict +1d10 HP radiant for 1 min once per long rest; foe attacks on the target during this time gain a 18-20 crit range, and the target drops to 0 hit points afterward"',
  'Poetry In Misery':
    'Section=combat ' +
    'Note="R30\' Can use a reaction when self or an ally rolls a 1 on an attack, ability check, or save to regain 1 use of Bardic Inspiration"',
  'Sorrowful Fate':
    'Section=combat ' +
    'Note="Can expend 1 Bardic Inspiration die to change a foe save to Charisma once per short rest; failure on the save inflicts +1d%{bardicInspirationDie} HP psychic"',
  'Tale Of Hubris':
    'Section=combat ' +
    'Note="R60\' Can use a reaction upon a foe critical hit and expend 1 Bardic Inspiration die to give attacks on the foe a %{levels.Bard<14?18:17}-20 crit range for 1 min or until the first critical hit"',

  // Cleric - Blood Domain, ref Taldorei
  'Blood Domain Spells':
    'Spells=' +
      '"1:False Life","1:Sleep",' +
      '"3:Hold Person","3:Ray Of Enfeeblement",' +
      '"5:Haste","5:Slow",' +
      '"7:Blight","7:Stoneskin",' +
      '"9:Dominate Person","9:Hold Monster"',
  'Blood Puppet':
    'Section=magic ' +
    'Note="R60\' Can use Channel Divinity to force a %{levels.Cleric<17?\'Large\':\'Huge\'} target to move half its Speed and attack a chosen target or to interact with an object (save Wisdom negates; additional saves each rd end) for concentration up to 1 min"',
  'Bloodletting Focus':
    'Section=magic ' +
    'Note="Harming spells inflict +(spell level + 2) HP necrotic"',
  'Bonus Proficiencies (Blood Domain)':
    'Section=combat Note="Weapon Proficiency (Martial Weapons)"',
  'Crimson Bond':
    'Section=magic ' +
    'Note="Can use Channel Divinity to bond with a seen target or with a target\'s blood to learn its distance, direction, hit points, and conditions for concentration up to 1 hr; can share the target\'s sight or hearing for %{wisdomModifier>?1} min (save Constitution negates), suffering 2d6 HP necrotic and ending the bond"',
  // Divine Strike as SRD5E
  'Sanguine Recall':
    'Section=magic ' +
    'Note="Can recover up to %{(levels.Cleric+1)//2} spell slot levels (level 5 maximum), suffering 1d8 HP necrotic per slot level, once per long rest"',
  'Vascular Corruption Aura':
    'Section=combat ' +
    'Note="30\' radius inflicts 3d6 HP necrotic and half healing on foes for 1 min once per long rest"',
  // Cleric - Moon Domain
  'Blessing Of The Blood-Drenched Moon':
    'Section=combat ' +
    'Note="R30\' Can use Channel Divinity to give a target advantage on attacks on foes that are adjacent to an ally for 10 min"',
  'Blessing Of The Full Moon':
    'Section=feature ' +
    'Note="Has the Blessing Of The Blood-Drenched Moon and Blessing Of The Watchful Moon features"',
  'Blessing Of The Watchful Moon':
    'Section=magic ' +
    'Note="R30\' Can use Channel Divinity to give a target +10 Speed and advantage on Perception and Survival involving tracking or smell for 1 hr"',
  'Clarity Of Catha':
    'Section=magic ' +
    'Note="R30\' Can use a reaction to give a target advantage on a Wisdom save %{proficiencyBonus} times per long rest"',
  'Eclipse Of Ill Omen':
    'Section=combat ' +
    'Note="60\' radius dim red glow blocks other light and inflicts disadvantage on saves by targets, and radiant damage inflicted by self within the glow once per turn also inflicts half speed and no healing, for concentration up to 1 min once per long rest"',
  'Empowered Cantrips':
    'Section=magic Note="Cleric cantrips inflict +%{wisdomModifier} HP"',
  'Mind Of Two Moons':
    'Section=magic ' +
    'Note="Can use Channel Divinity to maintain concentration on two Moon Domain spells simultaneously, suffering disadvantage on concentration Constitution saves"',
  'Moon Domain Spells':
    'Spells=' +
      '"1:Faerie Fire","1:Silent Image",' +
      '"3:Invisibility","3:Moonbeam",' +
      '"5:Hypnotic Pattern","5:Major Image",' +
      '"7:Greater Invisibility","7:Hallucinatory Terrain",' +
      '"9:Dream","9:Passwall"',

  // Druid - Circle Of The Blighted
  'Blighted Shape':
    'Section=magic,skill ' +
    'Note=' +
      '"Wild Shape gives +2 Armor Class and +60\' Darkvision",' +
      '"Skill Proficiency (Intimidation)"',
  'Call Of The Shadowseeds':
    'Section=magic ' +
    'Note="Can use a reaction after a creature takes damage within the Defile Ground radius to summon a blighted sapling (Armor Class %{10+proficiencyBonus}; %{levels.Druid*2} hit points; %{levels.Druid>=14?\'2 \':\'\'}+%{spellAttackModifier.D} %{levels.Druid>=14?\'attacks each inflict\':\'attack inflicts\'} 2d4+%{proficiencyBonus} HP piercing) adjacent to it %{proficiencyBonus} times per long rest"',
  'Defile Ground':
    'Section=combat ' +
    'Note="R60\' %{levels.Druid<10?10:20}\' radius creates difficult terrain for foes and inflicts +1d%{levels.Druid<10?4:levels.Druid<14?6:8} HP necrotic from the first hit on each creature each turn for 1 min once per short rest; can use a bonus action each turn to move it 30\'"',
  'Foul Conjuration':
    'Section=magic ' +
    'Note="Summoned creatures gain immunity to necrotic, poison, and the poisoned condition and, when killed or on command, produce a R5\' toxic shower that inflicts 1d4+ HP necrotic (save Constitution negates)"',
  'Incarnation Of Corruption':
    'Section=combat,combat,save ' +
    'Note=' +
      '"+2 Armor Class",' +
      '"Can use a bonus action to gain %{proficiencyBonus} temporary hit points when within Defile Ground radius",' +
      '"Has resistance to necrotic"',

  // Monk - Way Of The Cobalt Soul, ref Taldorei
  'Debilitating Barrage':
    'Section=combat ' +
    'Note="Can spend 3 ki points after an unarmed hit to inflict vulnerability to a chosen damage type or to suppress resistance to it for 1 min or until the end of a turn in which the target suffers that type of damage"',
  'Extort Truth':
    'Section=combat ' +
    'Note="Can spend 1 ki point after an unarmed hit to prevent the target from lying and to give advantage on Charisma checks directed at it (save Charisma negates) for 10 min"',
  'Extract Aspects':
    'Section=combat ' +
    'Note="Flurry Of Blows hits reveal the target\'s condition immunities and damage vulnerabilities, resistance, and immunities and, until the next rest, allow using a reaction in response to a missed attack on self by the target to make an unarmed attack"',
  'Mind Of Mercury':
    'Section=combat ' +
    'Note="Can spend 1 ki point for an extra reaction once per turn"',
  'Mystical Erudition':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose %V from Arcana, History, Investigation, Nature, Religion)/Language (Choose %V from any)"',

  // Paladin - Oath Of The Open Sea
  'Aura Of Liberation':
    'Section=magic ' +
    'Note="R%{levels.Paladin<18?10:30}\' Targets cannot be grappled or restrained, can spend 5\' of movement to escape from a grapple or restraint, and ignore underwater movement and attack penalties"',
  'Fury Of The Tides':
    'Section=combat ' +
    'Note="Can use a bonus action and Channel Divinity to inflict a 10\' push with a successful weapon attack once per rd for 1 min; this inflicts %{charismaModifier} HP bludgeoning if obstructed"',
  'Marine Layer':
    'Section=magic ' +
    'Note="Can use Channel Divinity to create a 20\' radius fog around self that lightly obscures vision for 10 min"',
  'Mythic Swashbuckler':
    'Section=magic ' +
    'Note="Can gain a %{speed}\' climb Speed, use of Dash or Disengage as a bonus action, and advantage on Dexterity checks, Dexterity saves, Athletics, and attacks vs. an adjacent foe when no other foe is adjacent, for 1 min once per long rest"',
  'Oath Of The Open Sea Spells':
    'Spells=' +
      '"3:Create Or Destroy Water","3:Expeditious Retreat",' +
      '"5:Augury","5:Misty Step",' +
      '"9:Call Lightning","9:Freedom Of The Waves",' +
      '"13:Control Water","13:Freedom Of Movement",' +
      '"17:Commune With Nature","17:Freedom Of The Winds"',
  'Stormy Waters':
    'Section=combat ' +
    'Note="Can use a reaction when a target moves into or out of reach to inflict 1d12 HP bludgeoning and knocked prone (save DC %{spellDifficultyClass.P} Strength HP only)"',

  // Sorcerer - Runechild, ref Taldorei
  'Arcane Exemplar':
    'Section=magic ' +
    'Note="Can use a bonus action and discharge 1 rune to gain a 60\' fly speed and resistance to spell damage, inflict disadvantage vs. self spells, and regain hit points equal to the spell\'s level from casting until the end of the turn once per long rest, suffering stunned for 1 turn afterward; discharging an additional rune each turn extends the effects for that turn"',
  'Essence Runes':
    'Section=magic ' +
    'Note="Spending Sorcery Points charges an equal number of runes (maximum %{levels.Sorcerer}), and 1 sorcery point can be spent as a bonus action to charge 2 runes; 5 charged runes emit a bright light in a 5\' radius, and remaining charged runes become inert after a long rest"',
  'Glyph Of Aegis':
    'Section=magic ' +
    'Note="Can use a reaction in response to taking damage to discharge runes, negating 1d%{levels.Sorcerer<14?6:8} HP of damage for each%{levels.Sorcerer<8?\'\':\'; touch can transfer the protection of up to 3 runes to another creature for 1 hr\'}"',
  'Manifest Inscriptions':
    'Section=skill ' +
    'Note="R60\' Can discharge 1 rune to cause hidden glyphs to glow for 1 min and to gain advantage on Arcana to understand them"',
  'Runic Magic':
    'Spells=' +
      '"1:Longstrider","1:Protection From Evil And Good",' +
      '"3:Lesser Restoration","3:Protection From Poison",' +
      '"5:Glyph Of Warding","5:Magic Circle",' +
      '"7:Death Ward","7:Freedom Of Movement",' +
      '"9:Greater Restoration","9:Telekinesis"',
  'Runic Torrent':
    'Section=magic ' +
    'Note="Can discharge 2 runes to change a spell\'s damage to force and to cause it to inflict a 15\' push or knocked prone (save Strength negates) once per short rest"',
  'Sigilic Augmentation':
    'Section=ability,save ' +
    'Note=' +
      '"Can use a reaction to discharge 1 rune and gain advantage on a Strength, Dexterity, or Constitution check",' +
      '"Can use a reaction to discharge 1 rune and gain advantage on a Strength, Dexterity, or Constitution save once per long rest"',

  // Wizard - Blood Magic
  'Bond Of Mutual Suffering':
    'Section=combat ' +
    'Note="Can use a reaction in response to suffering damage to inflict equal damage on the attacker %{levels.Wizard<14?\'once\':\'2 times\'} per short rest"',
  'Blood Channeling':
    'Section=magic ' +
    'Note="Can use own damaged body as an arcane focus and can forego material components when casting by suffering 1d10 HP necrotic per 50 GP"',
  'Glyph Of Hemorrhaging':
    'Section=magic ' +
    'Note="Can curse a successful spell attack target to suffer +1d6 HP necrotic from each attack for 1 min (save Constitution ends) once per short rest"',
  'Sanguine Burst':
    'Section=magic ' +
    'Note="Can suffer HP necrotic equal to a spell\'s level to reroll %{intelligenceModifier>1?\'up to \'+intelligenceModifier+\' damage dice\':\'1 damage die\'}"',
  'Thicker Than Water':
    'Section=combat ' +
    'Note="Regains +%{proficiencyBonus} hit points from healing spells and has resistance to nonmagical bludgeoning, piercing, and slashing during spell concentration"',

  // Backgrounds
  'A Favor In Turn': // ref Taldorei
    'Section=feature ' +
    'Note="Can ask for a 20-word favor through a contact in exchange for a future favor"',
  'Academic Requisition': // ref Taldorei
    'Section=skill ' +
    'Note="Can access school tools and gain services through the school at a 25% discount"',
  'Elemental Harmony': // ref Taldorei
    'Section=magic ' +
    'Note="Can create a minor elemental effect: a puff of wind, a burst of flame, a small rock that lasts 1 min, or a cup of cold or hot water"',
  'Fell Teachings':
    'Section=skill Note="Has advantage on Religion about a chosen Betrayer God"',
  'Legacy Of Secrecy':
    'Section=feature Note="Possession of a firearm changes others\' reactions"',
  'Rifle Corps Relationship':
    'Section=feature ' +
    'Note="Has current or past relationships within the Rifle Corps"',

  // Blessing
  "Fortune's Grace":
    'Section=combat ' +
    'Note="Can reroll an attack, ability, or saving throw, force a reroll on an attacker, or force a reroll on a save vs. a self spell, once per long rest"',

  // Feats
  'Cruel': // ref Taldorei
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Can spend %{proficiencyBonus} cruelty dice per long rest",' +
      '"Can spend 1 cruelty die with a successful attack to inflict +1d6 HP or after a critical hit to gain 1d6 temporary hit points",'+
      '"Can spend 1 cruelty die to gain +1d6 on Intimidation"',
  'Flash Recall': // ref Taldorei
    'Section=magic ' +
    'Note="Can use a bonus action to replace a prepared spell once per short rest"',
  'Mystic Conflux': // ref Taldorei
    'Section=magic ' +
    'Note="Can attune 4 items and can cast <i>Identify</i> without expending a spell slot once per long rest" ' +
    'Spells=Identify',
  'Remarkable Recovery': // ref Taldorei (Mending Affinity)
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Constitution",' +
      '"Regains +%{constitutionModifier>?1} hit points from healing effects and stabilization"',
  'Spelldriver': // ref Taldorei
    'Section=magic ' +
    'Note="Can cast an additional level 1 or 2 spell once per turn"',
  'Thrown Arms Master': // ref Taldorei
    'Section=ability,combat,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Strength, Dexterity)",' +
      '"+20/+40 thrown weapon range",' +
      '"Can throw any weapon; one-handed weapons have range 20/60, two-handed weapons 15/30, and light weapons return after a missed throw"',
  'Vital Sacrifice':
    'Section=combat ' +
    'Note="Can suffer 1d6 HP necrotic to gain 1d6 on an attack, to inflict +2d6 HP necrotic, or to reduce a foe Strength, Dexterity, or Constitution save by 1d4, within 1 hr"'

};
TaldoreiReborn.FEATURES =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATURES, TaldoreiReborn.FEATURES_ADDED);
TaldoreiReborn.SPELLS_ADDED = {

  'Freedom Of The Waves':
    'CastingTime=Action ' +
    'School=Conjuration ' +
    'Level=D3,R3,S3 ' +
    'Description=' +
      '"R120\' 15\' radius inflicts 2d8 HP bludgeoning and knocks prone (save Strength negates; %{mdf} designated creatures automatically succeed); self can teleport within the affected area"',
  'Freedom Of The Winds':
    'CastingTime=Action ' +
    'School=Abjuration ' +
    'Level=D5,R5,S5 ' +
    'Description=' +
      '"Self gains a 60\' flying speed and advantage vs. grappled, restrained, and paralyzed for concentration up to 10 min; can use a reaction in response to an attack to teleport 60\', ending the spell"'

};
TaldoreiReborn.SPELLS =
  Object.assign({}, (window.PHB5E||window.SRD5E).SPELLS, TaldoreiReborn.SPELLS_ADDED);

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
TaldoreiReborn.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'Class')
    TaldoreiReborn.classRulesExtra(rules, name);
  else if(type == 'Feat')
    TaldoreiReborn.featRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
TaldoreiReborn.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  if(name == 'Cleric') {
    rules.defineRule
      ('clericHasDivineStrike', 'features.Blood Domain', '=', '1');
    rules.defineRule
      ('divineStrikeDamageType', 'features.Blood Domain', '=', '"necrotic"');
  } else if(name == 'Monk') {
    rules.defineRule('skillNotes.mysticalErudition',
      classLevel, '=', 'source<11 ? 1 : source<17 ? 2 : 3'
    );
  }
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
TaldoreiReborn.featRulesExtra = function(rules, name) {
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

/* Returns an array of plugins upon which this one depends. */
TaldoreiReborn.getPlugins = function() {
  let result = [PHB5E, SRD5E];
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
    '<h2>Taldorei Reborn Quilvyn Plugin Notes</h2>\n' +
    '<p>\n' +
    'Taldorei Reborn Quilvyn Plugin Version ' + TaldoreiReborn.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn makes the Fortune\'s Grace feature of the Fate Touched\n' +
    '  blessing available as a special feat. To use it, add the line\n' +
    '  "* +1 Feat" to the character notes, then select Fortune\'s Grace\n' +
    '  in the Feats pull-down.\n' +
    '  </li><li>\n' +
    '  The Taldorei Reborn rule set allows you to add homebrew choices for' +
    '  all of the same types discussed in the <a href="plugins/homebrew-srd5e.html">SRD 5E Homebrew Examples document</a>.' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Portions of Quilvyn\'s Taldorei Reborn rule set are unofficial Fan Content\n' +
    'permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. © Wizards ' +
    'of the Coast LLC.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Darrington Press LLC. Portions ' +
    'of the materials used are property of Darrington Press LLC. © Darrington ' +
    'Press LLC.\n' +
    '</p><p>\n' +
    'Tal\'dorei Campaign Setting Reborn © 2021 Darrington Press LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
