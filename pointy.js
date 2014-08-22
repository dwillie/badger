loadFontAwesome = function() {
    link = document.createElement( "link" );
    link.href  = "https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"
    link.type  = "text/css";
    link.rel   = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName( "head" )[0].appendChild( link );
}

awesomeIcon = function(iconName) {
    icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-" + iconName);

    return icon;
}

getBadgesContainer = function(card) {
    return card.node.getElementsByClassName("badges")[0];
}

getCardText = function(card) {
    return card.node.getElementsByClassName("js-card-name")[0].innerHTML;
}

setCardText = function(card, text) {
    card.node.getElementsByClassName("js-card-name")[0].innerHTML = text;
}

addBadge = function(card, badgeText, iconName, bgColor) {
    badgesContainer = getBadgesContainer(card);

    badge = document.createElement("div");
    badge.classList.add("pointy-badge");
    badge.classList.add("badge");
    badge.style.backgroundColor = bgColor;
    badge.innerHTML = awesomeIcon(iconName).outerHTML;
    badge.innerHTML += " " + badgeText;

    badgesContainer.innerHTML += badge.outerHTML;
}

processBadge = function(card, reg, iconName, bgColor) {
    cardText   = getCardText(card);
    regexMatch = reg.exec(cardText);
    if (!regexMatch) {
        return;
    }

    cardScore = regexMatch[1];
    setCardText(card, cardText.replace(regexMatch[0], ""));
    addBadge(card, cardScore, iconName, bgColor);
}

cleanBadges = function(card) {
    // TODO something less awful
    badgesContainer = getBadgesContainer(card);
    while (badgesContainer.getElementsByClassName("pointy-badge").length > 0) {
        badgesContainer.getElementsByClassName("pointy-badge")[0].outerHTML = "";
    }
}

cleanCard = function(card) {
    setCardText(card, card.text);
    cleanBadges(card);
}

processList = function(list) {
    scoreMatcher   = new RegExp(/\(([^\)]*)\)/g);
    hashtagMatcher = new RegExp(/\#([a-zA-Z]+)/g);
    for (var i = 0; i < list.cards.length; i++)
    {
        processBadge(list.cards[i], scoreMatcher, "trophy", "#3DCD51");
        processBadge(list.cards[i], hashtagMatcher, "tag", "#DEB74E");
    }
}

clearList = function(list) {
    for (var i = 0; i < list.cards.length; i++)
    {
        cleanCard(list.cards[i]);
    }
}

refreshCycle = function(meta) {
    for (var i = 0; i < meta.lists.length; i++) {
        clearList(meta.lists[i]);
    }

    loadMeta(meta);

    for (i = 0; i < meta.lists.length; i++) {
        processList(meta.lists[i]);
    }

    setTimeout(function() {
        refreshCycle(meta);
    }, 2500);
}

loadMeta = function(meta) {
    meta.lists = [];
    var lists = document.getElementsByClassName("list");
    for (var i = 0; i < lists.length; i++) {
        if (lists[i].classList.contains("add-list")) {
            continue;
        }

        var list = {
            pageIndex: i,
            node: lists[i],
            cards: []
        };

        var cards = list.node.getElementsByClassName("list-card");
        for (var j = 0; j < cards.length; j++) {
            var card = {
                node: cards[j]
            };

            card.text = getCardText(card);
            list.cards.push(card);
        }
        meta.lists.push(list);
    }
}

main = function() {
    loadFontAwesome();

    var meta = {
        lists: []
    };
    loadMeta(meta);
    refreshCycle(meta);
}

window.onload = main
