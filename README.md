# Badger

Badger is a Chrome extension for adding and viewing arbitrary badges and weightings to Trello cards.

## Installation

1. Clone the repository to a local directory.
2. Go to `chrome://extensions` in Chrome.
3. Click *Load unpacked extension...*
4. Select the directory to which you cloned the repository.
5. Open Trello in a new tab. You should see a Badger icon on the right-hand side of the address bar.

## Usage/syntax

* Tag: `#mytag`
* Dependency: `d(X)`, where `X` is the ID of another card
* Time estimate: `~X`, where `X` is a number of days. This will be aggregated at the top of the list.
* Weight/score: `(X)`, where X is a number. This will be aggregated at the top of the list.

## Customisation

To customise badges/lists, click the Badger icon on the right-hand side of the address bar to edit the JSON configuration file.

### Card badges

Each card badge is identified by the following fields:

* `name`: Badge name/type
* `field`: Internal badge identifier
* `icon`: The Font Awesome icon to display on the badge
* `regex`: Text to be matched and removed from the card title
* `textColor`: Badge text foreground colour
* `bgColor`: Badge background colour
* `fontSize`: Font size for badge text
* `fontWeight`: Font weight for badge text

### List badges

* `name`: See above
* `field`: See above
* `icon`: See above
* `regex`: See above
* `textColor`: See above
* `bgColor`: See above
* `fontSize`: See above
* `fontWeight`: See above
* `reduce`: JavaScript function used to reduce information from cards in the list down to a single value (e.g. producing "2 weeks and 3 days" by summing time estimates from each card)
* `reduceInit`: Initial value for reduce function
