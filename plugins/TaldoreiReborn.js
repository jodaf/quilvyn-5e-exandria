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

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, PHB5E.ARMORS, PHB5E.SHIELDS, PHB5E.WEAPONS);
  SRD5E.magicRules(rules, PHB5E.SCHOOLS, TaldoreiReborn.SPELLS);
  SRD5E.identityRules(
    rules, PHB5E.ALIGNMENTS, TaldoreiReborn.BACKGROUNDS, TaldoreiReborn.CLASSES,
    TaldoreiReborn.DEITIES, {}, PHB5E.RACES
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

TaldoreiReborn.VERSION = '2.4.1.0';

TaldoreiReborn.BACKGROUNDS_ADDED = {
  'Ashari':
    'Equipment=' +
      '"Traveler\'s Clothes","Herbalism Kit","Staff","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Nature/Choose 1 from Arcana, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Language (Primordial)","1:Elemental Harmony"',
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
      '"1:Language (Choose 2 from any)","1:Academic Requisition"',
  'Reformed Cultist':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Religion)",' +
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
    '"features.Blood Domain ? 1:Bonus Proficiencies (Blood Domain)",' +
    '"features.Blood Domain ? 1:Bloodletting Focus",' +
    '"features.Blood Domain ? 2:Crimson Bond",' +
    '"features.Blood Domain ? 6:Blood Puppet",' +
    '"features.Blood Domain ? 6:Sanguine Recall",' +
    '"clericHasDivineStrike ? 8:Divine Strike",' +
    '"features.Blood Domain ? 17:Vascular Corruption Aura",' +
    '"features.Moon Domain ? 1:Clarity Of Catha",' +
    '"features.Moon Domain ? 2:Blessing Of The Watchful Moon",' +
    '"features.Moon Domain ? 2:Blessing Of The Blood-Drenched Moon",' +
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
    '"features.Oath Of The Open Sea ? 7:Aura Of Liberation",' +
    '"features.Oath Of The Open Sea ? 15:Stormy Waters",' +
    '"features.Oath Of The Open Sea ? 20:Mythic Swashbuckler"',
  'Sorcerer':
    '"features.Runechild ? 1:Essence Runes",' +
    '"features.Runechild ? 1:Glyph Of Aegis",' +
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
  'Cruel':'Type=General',
  'Flash Recall':'Type=General Require="features.Spellcasting"',
  "Fortune's Grace":'Type=Special',
  'Mystic Conflux':'Type=General',
  'Remarkable Recovery':'Type=General',
  'Spelldriver':
    'Type=General ' +
    'Require="level >= 11","features.Spellcasting || features.Pact Magic"',
  'Thrown Arms Master':'Type=General',
  'Vital Sacrifice':'Type=General'
};
TaldoreiReborn.FEATS =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATS, TaldoreiReborn.FEATS_ADDED);
TaldoreiReborn.FEATURES_ADDED = {

  // Backgrounds
  'A Favor In Turn':
    'Section=skill ' +
    'Note="May ask a 20-word favor from a contact in return for a future favor"',
  'Academic Requisition':
    'Section=skill ' +
    'Note="May access school tools and gain services through school at a 25% discount"',
  'Elemental Harmony':
    'Section=magic Note="May produce minor elemental effects"',
  'Fell Teachings':
    'Section=skill Note="Adv on Religion about chosen Betrayer God"',
  'Legacy Of Secrecy':
    'Section=feature Note="Possession of a firearm changes others\' reactions"',
  'Rifle Corps Relationship':
    'Section=feature Note="Has current or past relationships w/in WRC"',

  // Paths
  'Arcane Exemplar':
    'Section=magic ' +
    'Note="May discharge 1 rune to gain 60\' fly speed, inflict Disadv vs. self spells, gain resistance to spell damage, and regain spell level HP from casting for 1 rd 1/long rest; stunned afterward for 1 rd"',
  'Aura Of Liberation':
    'Section=magic ' +
    'Note="R%{levels.Paladin<18?10:30}\' Targets cannot be grappled or restrained, ignore underwater movement and attack penalties"',
  'Blessing Of The Blood-Drenched Moon':
    'Section=magic ' +
    'Note="R30\' May use Channel Divinity to give target Adv on attacks on foes that are adjacent to an ally for 10 min"',
  'Blessing Of The Watchful Moon':
    'Section=magic ' +
    'Note="R30\' May use Channel Divinity to give target +10 Speed and Adv on Perception and Survival (tracking and smell) for 1 hr"',
  'Blighted Shape':
    'Section=magic,skill ' +
    'Note=' +
      '"Wild Shape gives +2 AC and 60\' darkvision",' +
      '"Skill Proficiency (Intimidation)"',
  'Blood Channeling':
    'Section=magic ' +
    'Note="May use own damaged body as arcane focus/May suffer 1d10 HP necrotic per 50 GP to forego material components when casting"',
  'Blood Domain':
    'Spells=' +
      '"1:False Life",1:Sleep,' +
      '"3:Hold Person","3:Ray Of Enfeeblement",' +
      '5:Haste,5:Slow,' +
      '7:Blight,7:Stoneskin,' +
      '"9:Dominate Person","9:Hold Monster"',
  'Blood Puppet':
    'Section=magic ' +
    'Note="R60\' May use Channel Divinity to force a %{levels.Cleric<17?\'Large\':\'Huge\'} target to move at half speed and attack or to interact with an object (Wisdom ends) for conc up to 1 min"',
  'Bloodletting Focus':
    'Section=magic ' +
    'Note="Harming spells inflict +(spell level + 2) HP necrotic"',
  'Bond Of Mutual Suffering':
    'Section=magic ' +
    'Note="May use Reaction to inflict equal damage on attacker %{levels.Wizard<14?1:2}/short rest"',
  'Bonus Proficiencies (Blood Domain)':
    'Section=feature Note="Weapon Proficiency (Martial)"',
  'Call Of The Shadowseeds':
    'Section=magic ' +
    'Note="May use Reaction after damage w/in Defile Ground area to summon a blighted sapling (AC %{10+proficiencyBonus}; HP %{levels.Druid*2}; attack +%{spellAttackModifier.D} 2d4+%{proficiencyBonus} HP piercing) %{proficiencyBonus}/long rest"',
  'Clarity Of Catha':
    'Section=magic ' +
    'Note="R30\' May use Reaction to give target Adv on a Wisdom save %{proficiencyBonus}/long rest"',
  'Crimson Bond':
    'Section=magic ' +
    'Note="May use Channel Divinity to bond with seen target or target blood; knows distance, direction, HP, and conditions for conc up to 1 hr and may suffer 2d6 HP necrotic to share sight or sound (Constitution neg) for %{wisdomModifier>?1} min"',
  'Debilitating Barrage':
    'Section=combat ' +
    'Note="May spend 3 Ki Points after an unarmed hit to inflict vulnerability (or to suppress resistance) to chosen damage type for 1 min or until damaged"',
  'Defile Ground':
    'Section=magic ' +
    'Note="R60\' %{levels.Druid<10?10:20}\' radius inflicts difficult terrain and +1d%{levels.Druid<10?4:levels.Druid<14?6:8} HP necrotic on foes for 1 min 1/short rest"',
  'Demolishing Might':
    'Section=combat ' +
    'Note="Melee weapons inflict x2 damage vs. objects and +1d8 HP damage vs. constructs"',
  'Eclipse Of Ill Omen':
    'Section=magic ' +
    'Note="60\' radius dim red glow blocks other light and inflicts Disadv on saves; radiant damage by self also inflicts half speed and no healing on target, for conc up to 1 min 1/long rest"',
  'Empowered Cantrips':
    'Section=magic Note="+%{wisdomModifier} HP cleric cantrip damage"',
  'Essence Runes':
    'Section=magic ' +
    'Note="Spending Sorcery Points charges an equal number of runes (maximum %{levels.Sorcerer}); 5 charged runes emit a bright light in a 5\' radius"',
  'Extort Truth':
    'Section=combat ' +
    'Note="May spend 1 Ki Point after an unarmed hit to prevent target lying and to give all Adv on Charisma vs. foe for 10 min (Charisma neg)"',
  'Extract Aspects':
    'Section=combat ' +
    'Note="May use Reaction after a Flurry Of Blows hit to gain info about target; may use Reaction for an unarmed attack when target misses until next rest"',
  "Fortune's Grace":
    'Section=feature ' +
    'Note="May reroll an attack, ability, or save or force a foe reroll 1/long rest"',
  'Foul Conjuration':
    'Section=magic ' +
    'Note="Summoned creatures gain immunity to necrotic damage, poison damage, and poisoned condition and produce a R5\' toxic shower (inflicts 1d4+ HP necrotic; Constitution neg) when killed or on command"',
  'Fury Of The Tides':
    'Section=combat ' +
    'Note="May use Channel Divinity and a bonus action to inflict 10\' push w/successful weapon attack (+%{charismaModifier} HP bludgeoning if obstructed) 1/rd for 1 min"',
  'Glyph Of Aegis':
    'Section=magic ' +
    'Note="May use Reaction to discharge runes, negating 1d%{levels.Sorcerer<14?6:8} damage each%{levels.Sorcerer<8?\'\':\'; touch may transfer the protection of up to 3 runes for 1 hr\'}"',
  'Glyph Of Hemorrhaging':
    'Section=magic ' +
    'Note="May curse a successful spell attack target to suffer +1d6 HP necrotic from each attack for 1 min (Constitution ends) 1/short rest"',
  'Hurricane Strike':
    'Section=combat ' +
    'Note="Pushing foe allows an adjacent ally to use Reaction for a melee attack, and self may leap to knock pushed foe prone (DC %{8 + proficiencyBonus + strengthModifier} Strength neg)"',
  'Impending Misfortune':
    'Section=feature ' +
    'Note="May gain +10 on current attack or save and suffer -10 on next attack or save 1/short rest"',
  'Incarnation Of Corruption':
    'Section=combat,combat,save ' +
    'Note=' +
      '"+2 Armor Class",' +
      '"Gains %{proficiencyBonus} temporary HP from Defile Ground",' +
      '"Resistance to necrotic damage"',
  'Manifest Inscriptions':
    'Section=magic ' +
    'Note="R60\' May discharge 1 rune to reveal hidden glyphs and gain Adv on Arcana to understand"',
  'Marine Layer':
    'Section=magic ' +
    'Note="May use Channel Divinity to create a 20\' radius that obscures vision for 10 min"',
  'Mind Of Mercury':
    'Section=combat Note="May spend 1 Ki Point to gain an extra Reaction"',
  'Mind Of Two Moons':
    'Section=magic ' +
    'Note="May use Channel Divinity to maintain concentration on two Moon Domain spells simultaneously and to gain Adv on concentration Constitution saves"',
  'Moon Domain':
    'Spells=' +
      '"1:Faerie Fire","1:Silent Image",' +
      '3:Invisibility,3:Moonbeam,' +
      '"5:Hypnotic Pattern","5:Major Image",' +
      '"7:Greater Invisibility","7:Hallucinatory Terrain",' +
      '9:Dream,9:Passwall',
  'Mystical Erudition':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose %V from Arcana, History, Investigation, Nature, Religion)/Language (Choose %V from any)"',
  'Mythic Swashbuckler':
    'Section=ability,combat,save,skill ' +
    'Note=' +
      '"May gain Adv on Dexterity and %{speed} climb speed for 1 min 1/long rest",' +
      '"May gain Adv on attacks vs. an adjacent foe when no other foe is adjacent and Dash or Disengage as bonus action for 1 min 1/long rest",' +
      '"May gain Adv on Dexterity for 1 min 1/long rest",' +
      '"May gain Adv on Athletics 1/long rest"',
  'Nimbus Of Pathos':
    'Section=magic ' +
    'Note="Touched gains +4 AC, Adv on attack and saves, and +1d10 HP radiant damage and suffers foe crit on 18-20 for 1 min 1/long rest; touched drops to 0 HP afterward"',
  'Oath Of The Open Sea':
    'Spells=' +
      '"3:Create Or Destroy Water","3:Expeditious Retreat",' +
      '5:Augury,"5:Misty Step",' +
      '"9:Call Lightning","9:Freedom Of The Waves",' +
      '"13:Control Water","13:Freedom Of Movement",' +
      '"17:Commune With Nature","17:Freedom Of The Winds"',
  'Poetry In Misery':
    'Section=feature ' +
    'Note="R30\' May use Reaction to regain 1 use of Bardic Inspiration when self or an ally rolls a 1 on an attack, ability, or save"',
  'Resolute Stance':
    'Section=combat ' +
    'Note="May suffer Disadv on weapon attacks to gain grapple immunity and inflict Disadv on foe attacks"',
  'Runechild':
    'Spells=' +
      '1:Longstrider,"1:Protection From Evil And Good",' +
      '"3:Lesser Restoration","3:Protection From Poison",' +
      '"5:Glyph Of Warding","5:Magic Circle",' +
      '"7:Death Ward","7:Freedom Of Movement",' +
      '"9:Greater Restoration",9:Telekinesis',
  'Runic Torrent':
    'Section=magic ' +
    'Note="May discharge 2 runes to change spell damage to force and to push 15\' or knock prone (Strength neg) 1/short rest"',
  'Sanguine Burst':
    'Section=magic ' +
    'Note="May take spell level HP necrotic to reroll %{intelligenceModifier>?1} spell damage dice"',
  'Sanguine Recall':
    'Section=magic ' +
    'Note="May suffer up to %{(levels.Cleric+1)//2}d8 HP necrotic to recover an equal number of spell slot levels (level 5 max) 1/long rest"',
  'Sigilic Augmentation':
    'Section=magic ' +
    'Note="May use Reaction to discharge 1 rune, gaining Adv on a Strength, Dexterity, or Constitution check or save 1/long rest"',
  'Sorrowful Fate':
    'Section=combat ' +
    'Note="May spend 1 Bardic Inspiration die to change a foe save to Charisma; failure inflicts Bardic Inspiration die HP psychic 1/short rest"',
  'Spirit Of The Mountain':
    'Section=combat Note="Cannot be knocked prone or pushed during rage"',
  'Stormy Waters':
    'Section=combat ' +
    'Note="May use Reaction to inflict 1d12 HP bludgeoning and knocked prone (DC %{spellDifficultyClass.P} Strength HP only) on a target moving into or out of reach"',
  'Tale Of Hubris':
    'Section=combat ' +
    'Note="R60\' Upon a foe critical hit, may use Reaction and spend 1 Bardic Inspiration die to inflict %{levels.Bard<14?18:17}-20 crit range for attacks on foe for 1 min or until critical hit"',
  'Thicker Than Water':
    'Section=combat,save ' +
    'Note=' +
      '"Regains +%{proficiencyBonus} HP from healing spells",' +
      '"Resistance to nonmagical bludgeoning, piercing, and slashing damage during spell concentration"',
  'Thunderous Blows':
    'Section=combat ' +
    'Note="May push foe %{levels.Barbarian<10?5:10}\' w/a successful attack (Huge foe DC %{8+proficiencyBonus+strengthModifier} Strength neg)"',
  'Unstoppable':
    'Section=combat ' +
    'Note="Cannot be slowed, frightened, knocked prone, paralyzed, or stunned during rage"',
  'Vascular Corruption Aura':
    'Section=combat ' +
    'Note="R30\' Foes suffer 3d6 HP necrotic and half healing for 1 min 1/long rest"',

  // Feats
  'Cruel':
    'Section=feature,combat,skill ' +
    'Note=' +
      '"May use %{proficiencyBonus} Cruelty Points/long rest",' +
      '"May spend 1 Cruelty Point for +1d6 damage or to gain 1d6 temporary HP on crit",'+
      '"May spend 1 Cruelty Point for +1d6 on Intimidation"',
  'Flash Recall':
    'Section=magic Note="May replace a prepared spell 1/short rest"',
  'Mystic Conflux':
    'Section=magic ' +
    'Note="May attune 4 items/May cast <i>Identify</i> 1/long rest"',
  'Remarkable Recovery':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Constitution",' +
      '"Healing and stabilization restore +%{constitutionModifier>?1} HP"',
  'Spelldriver':
    'Section=magic Note="May cast an additional level 1 - 2 spell/rd"',
  'Thrown Arms Master':
    'Section=ability,combat,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Strength, Dexterity)",' +
      '"+20/+40 throw range",' +
      '"May throw any weapon (one-handed have range 20/60, two-handed 15/30); light weapon returns after a missed throw"',
  'Vital Sacrifice':
    'Section=feature ' +
    'Note="May suffer 1d6 HP necrotic to gain +1d6 attack, to inflict +2d6 HP necrotic, or to inflict -1d4 on foe Strength, Dexterity, or Constitution save w/in 1 hr"'

};
TaldoreiReborn.FEATURES =
  Object.assign({}, (window.PHB5E||window.SRD5E).FEATURES, TaldoreiReborn.FEATURES_ADDED);
TaldoreiReborn.SPELLS_ADDED = {

  'Freedom Of The Waves':
    'School=Conjuration ' +
    'Level=D3,R3,S3 ' +
    'Description=' +
      '"R120\' 15\' radius inflicts 2d8 HP bludgeoning and knocks prone (Strength neg); self may teleport w/in affected area"',
  'Freedom Of The Winds':
    'School=Abjuration ' +
    'Level=D5,R5,S5 ' +
    'Description=' +
      '"Self gains 60\' flying speed and Adv vs. grapple, restraint, and paralysis for conc up to 10 min; self may teleport 60\', ending spell"'

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
