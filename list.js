function List(pageIndex, node, cards) {
    return {
        pageIndex: pageIndex,
        node: node,
        cards: cards,
        badgesContainerNode: undefined,

        badgesContainer: function() {
            var badgesContainerNode = this.node.getElementsByClassName("pointy-list-badges")[0];

            if (badgesContainerNode === undefined) {
                badgesContainerNode = document.createElement("div");
                badgesContainerNode.classList.add("pointy-list-badges");
                badgesContainerNode.classList.add("badges");

                this.node.getElementsByClassName("list-header")[0].innerHTML += badgesContainerNode.outerHTML;
                badgesContainerNode = this.node.getElementsByClassName("pointy-list-badges")[0];
            }

            return badgesContainerNode;
        },

        addBadge: function(list, badgeText, badgeIcon, fontColor, badgeColor, fontSize, fontWeight) {
            var badge = newBadge(badgeText, badgeIcon, fontColor, badgeColor, fontSize, fontWeight);

            this.badgesContainer().innerHTML += badge.outerHTML;
        },

        processBadge: function(fieldName, iconName, fontColor, badgeColor, fontSize, fontWeight, reduceFunc, initialValue) {
            var result = this.cards.reduce(reduceFunc, initialValue);
            this[fieldName] = result;
            this.addBadge(result, iconName, fontColor, badgeColor, fontSize, fontWeight);
        },

        clear: function() {
            for (var i = 0; i < this.cards.length; i++)
            {
                this.cards[i].clean();
            }
        },

        process: function(config) {
            var fontColor = "#FFF", fontSize = "smaller", fontWeight = "400";
            for (var i = 0; i < this.cards.length; i++)
            {
                for (var j = 0; j < config.cardBadges.length; j++) {
                    var badgeConf = config.cardBadges[j];
                    this.cards[i].processBadge(badgeConf.regex, badgeConf.field, badgeConf.icon,
                                               badgeConf.textColor, badgeConf.bgColor,
                                               badgeConf.fontSize, badgeConf.fontWeight);
                }
            }

            for (var k = 0; k < config.listBadges.length; k++) {
                var listBadgeConf = config.listBadges[k];
                this.processBadge(listBadgeConf.field,     listBadgeConf.icon,
                                  listBadgeConf.textColor, listBadgeConf.bgColor,
                                  listBadgeConf.fontSize,  listBadgeConf.fontWeight,
                                  listBadgeConf.reduce,    listBadgeConf.reduceInit);
            }
        }
    };
}
