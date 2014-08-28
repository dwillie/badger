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

newBadge = function(text, icon, fontColor, badgeColor, fontSize, fontWeight) {
    badge = document.createElement("div");
    badge.classList.add("pointy-badge");
    badge.classList.add("badge");

    badge.style.color = fontColor;
    badge.style.backgroundColor = badgeColor;
    badge.style.fontSize = fontSize;
    badge.style.fontWeight = fontWeight;

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

addCardBadge = function(card, badgeText, iconName, fontColor, badgeColor, fontSize, fontWeight) {
    badgesContainer = getCardBadgesContainer(card);
    badge = newBadge(badgeText, iconName, fontColor, badgeColor, fontSize, fontWeight);
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

processCardBadge = function(card, reg, fieldName, iconName, fontColor, badgeColor, fontSize, fontWeight) {
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
        addCardBadge(card, matchContents, iconName, fontColor, badgeColor, fontSize, fontWeight);
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

addListBadge = function(list, badgeText, badgeIcon, fontColor, badgeColor, fontSize, fontWeight) {
    badgesContainer = getListBadgesContainer(list);
    badge = newBadge(badgeText, badgeIcon, fontColor, badgeColor, fontSize, fontWeight);
    badgesContainer.innerHTML += badge.outerHTML;
};

processListBadge = function(list, fieldName, iconName, fontColor, badgeColor, fontSize, fontWeight, reduceEval, initialValue) {
    var result = list.cards.reduce(function(previousValue, currentValue, index, array) {
        var result = previousValue;
        eval(reduceEval);
        return result;
    }, initialValue);

    list[fieldName] = result;
    addListBadge(list, result, iconName, fontColor, badgeColor, fontSize, fontWeight);
};

processList = function(list) {
    scoreMatcher   = new RegExp(/\(([0-9^\)]*)\)/g);
    hashtagMatcher = new RegExp(/#([a-zA-Z]+)/g);
    dayEstMatcher  = new RegExp(/~([0-9]+)/g);

    var fontColor = "#FFF", fontSize = "smaller", fontWeight = "400";
    for (var i = 0; i < list.cards.length; i++)
    {
        processCardBadge(list.cards[i], scoreMatcher, "score", "trophy", fontColor, "#55BB55", fontSize, fontWeight);
        processCardBadge(list.cards[i], hashtagMatcher, "tags[]", "tag", fontColor, "#666699", fontSize, fontWeight);
        processCardBadge(list.cards[i], dayEstMatcher, "daysEstimate", "calendar", fontColor, "#BB6666", fontSize, fontWeight);
    }

    processListBadge(list, "totalScore", "trophy", "#55BB55", "none", "16px", "300",
                     "if (!currentValue.score) { result = previousValue; } else { result = previousValue + parseInt(currentValue.score, 10); }", 0);
    processListBadge(list, "totalDays", "calendar", "#BB6666", "none", "16px", "300",
                     "if (!currentValue.daysEstimate) { result = previousValue; } else { result = previousValue + parseInt(currentValue.daysEstimate, 10); }", 0);
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
