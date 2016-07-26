function Card(node) {
    var card = {
        id: undefined,
        badgesContainerNode: undefined,
        node: node,
        originalText: node.getElementsByClassName("js-card-name")[0].innerHTML,

        initId: function() {
            var cardText     = this.text();
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

            this.setText(cardText);
        },

        badgesContainer: function() {
            return this.node.getElementsByClassName("badges")[0];
        },

        text: function() {
            return this.node.getElementsByClassName("js-card-name")[0].innerHTML;
        },

        setText: function(text) {
            this.node.getElementsByClassName("js-card-name")[0].innerHTML = text;
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

        processBadge: function(reg, fieldName, iconName, fontColor, badgeColor, fontSize, fontWeight) {
            var cardText     = this.text();
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

            this.setText(cardText);
        },

        cleanBadges: function() {
            // TODO something less awful
            var badgesContainer = this.badgesContainer();
            while (badgesContainer.getElementsByClassName("pointy-badge").length > 0) {
                badgesContainer.getElementsByClassName("pointy-badge")[0].outerHTML = "";
            }
        },

        clean: function() {
            this.setText(this.originalText);
            this.cleanBadges();
        }
    };

    card.initId();
    return card;
}
