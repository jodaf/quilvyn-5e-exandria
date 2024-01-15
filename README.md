## 5th Edition Exandria plugins for the Quilvyn RPG character sheet generator.
The quilvyn-5E-exandria package bundles modules that extend Quilvyn to work
with Exandria supplements, applying the rules from the following books:

- <a href="https://dnd.wizards.com/products/wildemount">Explorer's Guide to Wildemount</a>
- <a href="https://darringtonpress.com/taldorei-campaign-setting-reborn/">Tal'Dorei Campaign Setting Reborn</a>

### Requirements

quilvyn-5E-exandria relies on the 5th Edition SRD module installed by the
quilvyn-5E package, the PHB5E module installed by the quilvyn-phb5e package,
and the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-5e-exandria, unbundle the release package, making sure that the
contents of the plugins/ subdirectory are placed into the corresponding Quilvyn
installation subdirectory, then append the following lines to the file
plugins/plugins.js:

    RULESETS['Taldorei Reborn Campaign Setting using D&D 5E rules'] = {
      url:'plugins/TaldoreiReborn.js',
      group:'5E',
      require:'PHB5E.js'
    };
    RULESETS['Wildemount Campaign Setting using D&D 5E rules'] = {
      url:'plugins/Wildemount.js',
      group:'5E',
      require:'PHB5E.js'
    };

### Usage

Once the package plugins are installed as described above, start Quilvyn and
check the boxes next to one or more of the rule sets shown above from the rule
sets menu in the initial window.
