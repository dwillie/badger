function Card(node) {
    var card = {
        id: undefined,
        badgesContainerNode: undefined,
        node: node,
        oldRealText: undefined,

        initId: function() {
            var cardText     = this.realText();
            var regexMatches = cardText.matchAll(new RegExp("#([0-9]+)", "g"));
            if (!regexMatches || regexMatches.length < 1) {
                return;
            }

            for (var i = 0; i < regexMatches.length; i++) {
                var match = regexMatches[i];

                var fullMatch     = match[0];
                var matchContents = match[1];
                var matchContentsInt;

                try {
                    matchContentsInt = Number.parseInt(matchContents, 10);
                    this.id = matchContentsInt;
                    this.node.setAttribute("id", matchContentsInt);
                } catch (e) {
                    continue;
                }
            }

            this.setVisibleText(cardText);
        },

        refresh: function() {
            console.log('Refreshing card.');
            // If the card has been updated it's real text will have changed.
            if (this.oldRealText !== this.realText()) {
                console.log('Text has changed.');
                this.cleanBadges();
                this.oldRealText = this.realText();
                this.setVisibleText(this.oldRealText);
                this.processBadges();
            }
        },

        initFakeText: function() {
            var realTextElem = this.node.getElementsByClassName("js-card-name")[0];
            this.oldRealText = realTextElem.innerHTML;

            var fakeTextElem = realTextElem.cloneNode();
            fakeTextElem.className = "visible-text-override";
            realTextElem.style.display = 'none';

            realTextElem.parentNode.insertBefore(fakeTextElem, realTextElem.nextSibling);
        },

        initBadgesContainer: function() {
            var labelsElem = this.node.getElementsByClassName("list-card-labels")[0];
            var badgesContainer = document.createElement('div');
            badgesContainer.classList.add("badger-badges");
            labelsElem.parentNode.insertBefore(badgesContainer, labelsElem.nextSibling);
        },

        badgesContainer: function() {
            return this.node.getElementsByClassName("badger-badges")[0];
        },

        realText: function() {
            return this.node.getElementsByClassName("js-card-name")[0].innerHTML;
        },

        getVisibleText: function() {
            return this.node.getElementsByClassName("visible-text-override")[0].innerHTML;
        },

        setVisibleText: function(text) {
            this.node.getElementsByClassName("visible-text-override")[0].innerHTML = text;
        },

        addBadge: function(fieldName, badgeText, iconName, fontColor, badgeColor, fontSize, fontWeight) {
            var badgesContainer = this.badgesContainer();
            badge = newBadge(fieldName, badgeText, iconName, fontColor, badgeColor, fontSize, fontWeight);
            badgesContainer.appendChild(badge);
        },

        addValue: function(field, value) {
            if (field.indexOf("[]") != -1) {
                fieldName = field.replace("[]", "");
                if (!this[fieldName]) {
                    this[fieldName] = [];
                }
                this[fieldName].push(value);
            } else {
                this[field] = value;
            }
        },

        processBadges: function() {
            for (var j = 0; j < config.cardBadges.length; j++) {
                var badgeConf = config.cardBadges[j];
                this.processBadge(badgeConf.regex, badgeConf.field, badgeConf.icon,
                                  badgeConf.textColor, badgeConf.bgColor,
                                  badgeConf.fontSize, badgeConf.fontWeight);
            }
        },

        processBadge: function(reg, fieldName, iconName, fontColor, badgeColor, fontSize, fontWeight) {
            var cardText     = this.getVisibleText();
            var regexMatches = cardText.matchAll(reg);
            if (!regexMatches || regexMatches.length < 1) {
                return;
            }

            for (var i = 0; i < regexMatches.length; i++) {
                var match = regexMatches[i];

                var fullMatch     = match[0];
                var matchContents = match[1];

                this.addValue(fieldName, matchContents);
                cardText = cardText.replace(fullMatch, "");
                this.addBadge(fieldName, matchContents, iconName, fontColor, badgeColor, fontSize, fontWeight);
            }

            this.setVisibleText(cardText);
        },

        cleanBadges: function() {
            var badgesContainer = this.badgesContainer();
            badgesContainer.innerHTML = "";
        }
    };

    card.initBadgesContainer();
    card.initFakeText();
    card.initId();

    return card;
}
