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
  Wildemount.FEATS = Object.assign({}, PHB5E.FEATS);
  Wildemount.FEATURES =
    Object.assign({}, PHB5E.FEATURES, Wildemount.FEATURES_ADDED);
  Wildemount.PATHS = Object.assign({}, PHB5E.PATHS, Wildemount.PATHS_ADDED);
  Wildemount.RACES = Object.assign({}, PHB5E.RACES, Wildemount.RACES_ADDED);
  delete Wildemount.RACES['Dragonborn'];
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
    '"1:Runechild:Sorcerous Origin"'
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
Wildemount.FEATURES_ADDED = {

  // Backgrounds
  'Ballad Of The Grinning Fool':
    'Section=feature Note="May find shelter in city for self and companions"',
  'Shadow Network':
    'Section=feature Note="May write to distant Volstrucker members"',

  // Paths
  'Adjust Density':'Section=feature Note="TODO"',
  'Arcane Abeyance':'Section=feature Note="TODO"',
  'Chronal Shift':'Section=feature Note="TODO"',
  'Convergent Future':'Section=feature Note="TODO"',
  'Echo Avatar':'Section=feature Note="TODO"',
  'Event Horizon':'Section=feature Note="TODO"',
  'Gravity Well':'Section=feature Note="TODO"',
  'Legion Of One':'Section=feature Note="TODO"',
  'Manifest Echo':'Section=feature Note="TODO"',
  'Momentary Statis':'Section=feature Note="TODO"',
  'Reclaim Potential':'Section=feature Note="TODO"',
  'Shadow Martyr':'Section=feature Note="TODO"',
  'Temporal Awareness':'Section=feature Note="TODO"',
  'Unleash Incarnation':'Section=feature Note="TODO"',
  'Violent Attraction':'Section=feature Note="TODO"',

  // Races
  'Ageless':'Section=feature Note="Immune to aging"',
  'Cling To Life':
    'Section=combat Note="Successful death saving throw restores 1 HP"',
  'Revenance':'Section=feature Note="Detect as undead"',
  'Unsettling Presence':
    'Section=combat Note="R15\' Inflict Disadv on next target save 1/long rest"'

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
      '"2:Chronal Shift","2:Temporal Awareness","6:Momentary Statis",' +
      '"10:Arcane Abeyance","14:Convergent Future"',
  'Graviturgy Magic':
    'Group=Wizard ' +
    'Level=levels.Wizard ' +
    'Features=' +
      '"2:Adjust Density","6:Gravity Well","10:Violent Attraction",' +
      '"14:Event Horizon"'
};
Wildemount.RACES_ADDED = {
  'Hollow One':
    'Features=' +
      '1:Ageless,"1:Cling To Life",1:Revenance,"1:Unsettling Presence"'
};
Wildemount.SPELLS_ADDED = {
  'Dark Star':
    'School=Evocation ' +
    'Level=W8 ' +
    'Description="TODO"',
  "Fortune's Favor":
    'School=Divination ' +
    'Level=W2 ' +
    'Description="TODO"',
  'Gift Of Alacrity':
    'School=Divination ' +
    'Level=W1 ' +
    'Description="TODO"',
  'Gravity Fissure':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="TODO"',
  'Gravity Sinkhole':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description="TODO"',
  'Immovable Object':
    'School=Transmutation ' +
    'Level=W2 ' +
    'Description="TODO"',
  'Magnify Gravity':
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="TODO"',
  'Pulse Wave':
    'School=Evocation ' +
    'Level=W3 ' +
    'Description="TODO"',
  'Ravenous Void':
    'School=Evocation ' +
    'Level=W9 ' +
    'Description="TODO"',
  'Reality Break':
    'School=Conjuration ' +
    'Level=W8 ' +
    'Description="TODO"',
  'Sapping Sting':
    'School=Necromancy ' +
    'Level=W0 ' +
    'Description="TODO"',
  'Temporal Shunt':
    'School=Transmutation ' +
    'Level=W5 ' +
    'Description="TODO"',
  'Tether Essence':
    'School=Necromancy ' +
    'Level=W7 ' +
    'Description="TODO"',
  'Time Ravage':
    'School=Necromancy ' +
    'Level=W9 ' +
    'Description="TODO"',
  'Wristpocket':
    'School=Conjuration ' +
    'Level=W2 ' +
    'Description="TODO"'
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
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Wildemount.featRulesExtra = function(rules, name) {
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
Wildemount.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Blood Domain') {
    rules.defineRule
      ('magicNotes.bloodPuppet', pathLevel, '=', 'source<8 ? "Large" : "Huge"');
    rules.defineRule('magicNotes.sanguineRecall',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
  } else if(name == 'Runechild') {
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
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Wildemount Rule Set.\n' +
    '</p>\n' +
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
