// There's probably a better way for this but I cbf
// http://cwestblog.com/2013/02/26/javascript-string-prototype-matchall/
// Thanks Chris West.
String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

loadFontAwesome = function() {
    link = document.createElement( "link" );
    link.href  = "https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css";
    link.type  = "text/css";
    link.rel   = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName( "head" )[0].appendChild( link );
};

awesomeIcon = function(iconName) {
    icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-" + iconName);

    return icon;
};

newBadge = function(text, icon, color) {
    badge = document.createElement("div");
    badge.classList.add("pointy-badge");
    badge.classList.add("badge");
    badge.style.backgroundColor = color;
    badge.innerHTML = awesomeIcon(icon).outerHTML;
    badge.innerHTML += " " + text;

    return badge;
};

getCardBadgesContainer = function(card) {
    return card.node.getElementsByClassName("badges")[0];
};

getCardText = function(card) {
    return card.node.getElementsByClassName("js-card-name")[0].innerHTML;
};

setCardText = function(card, text) {
    card.node.getElementsByClassName("js-card-name")[0].innerHTML = text;
};

addCardBadge = function(card, badgeText, iconName, bgColor) {
    badgesContainer = getCardBadgesContainer(card);
    badge = newBadge(badgeText, iconName, bgColor);
    badgesContainer.innerHTML += badge.outerHTML;
};

addValueToCard = function(card, field, value) {
    if (field.indexOf("[]") != -1) {
        fieldName = field.replace("[]", "");
        if (!card[fieldName]) {
            card[fieldName] = [];
        }
        card[fieldName].push(value);
    } else {
        card[field] = value;
    }
};

processCardBadge = function(card, reg, fieldName, iconName, bgColor) {
    cardText     = getCardText(card);
    regexMatches = cardText.matchAll(reg);
    if (!regexMatches || regexMatches.length < 1) {
        return;
    }

    regexMatches.forEach(function(match){
        fullMatch     = match[0];
        matchContents = match[1];

        addValueToCard(card, fieldName, matchContents);
        cardText = cardText.replace(fullMatch, "");
        addCardBadge(card, matchContents, iconName, bgColor);
    });

    setCardText(card, cardText);
};

cleanCardBadges = function(card) {
    // TODO something less awful
    badgesContainer = getCardBadgesContainer(card);
    while (badgesContainer.getElementsByClassName("pointy-badge").length > 0) {
        badgesContainer.getElementsByClassName("pointy-badge")[0].outerHTML = "";
    }
};

cleanCard = function(card) {
    setCardText(card, card.text);
    cleanCardBadges(card);
};

getListBadgesContainer = function(list) {
    badgesContainer = list.node.getElementsByClassName("pointy-list-badges")[0];
    if (!badgesContainer) {
        badgesContainer = document.createElement("div");
        badgesContainer.classList.add("pointy-list-badges");
        badgesContainer.classList.add("badges");
        // Oof!
        list.node.getElementsByClassName("list-header")[0].innerHTML += badgesContainer.outerHTML;
        return getListBadgesContainer(list);
    }

    return badgesContainer;
};

addListBadge = function(list, badgeText, badgeIcon, badgeColor) {
    badgesContainer = getListBadgesContainer(list);
    badge = newBadge(badgeText, badgeIcon, badgeColor);
    badgesContainer.innerHTML += badge.outerHTML;
};

processListBadge = function(list, fieldName, iconName, badgeColor, reduceEval, initialValue) {
    result = list.cards.reduce(function(previousValue, currentValue, index, array) {
        return eval(reduceEval);
    }, initialValue);

    list[fieldName] = result;
    addListBadge(list, result, iconName, badgeColor);
};

processList = function(list) {
    scoreMatcher   = new RegExp(/\(([0-9^\)]*)\)/g);
    hashtagMatcher = new RegExp(/#([a-zA-Z]+)/g);
    dayEstMatcher  = new RegExp(/~([0-9]+)/g);

    for (var i = 0; i < list.cards.length; i++)
    {
        processCardBadge(list.cards[i], scoreMatcher, "score", "trophy", "#55BB55");
        processCardBadge(list.cards[i], hashtagMatcher, "tags[]", "tag", "#666699");
        processCardBadge(list.cards[i], dayEstMatcher, "daysEstimate", "calendar", "#BB6666");
    }

    processListBadge(list, "totalScore", "trophy", "#55BB55", "previousValue + parseInt(currentValue.score, 10)", 0);
    processListBadge(list, "totalDays", "calendar", "#BB6666", "previousValue + parseInt(currentValue.daysEstimate, 10)", 0);

};

clearList = function(list) {
    for (var i = 0; i < list.cards.length; i++)
    {
        cleanCard(list.cards[i]);
    }
};

refreshCycle = function(meta) {
    for (var i = 0; i < meta.lists.length; i++) {
        clearList(meta.lists[i]);
    }

    loadMeta(meta);

    for (i = 0; i < meta.lists.length; i++) {
        processList(meta.lists[i]);
    }

    console.log(meta);

    // setTimeout(function() {
    //      refreshCycle(meta);
    //}, 2500);
};

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
};

main = function() {
    loadFontAwesome();

    var meta = {
        lists: []
    };
    loadMeta(meta);
    refreshCycle(meta);
};

window.onload = main;
