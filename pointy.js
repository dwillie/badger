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

newTagContainer = function() {
    tagContainer = document.createElement("div");
    tagContainer.classList.add("tags-container");
    return tagContainer;
}

getTagsContainer = function(card) {
    tagsContainer = card.node.getElementsByClassName("tags-container")[0];
    if (!tagsContainer) {
        card.node.innerHTML += newTagContainer().outerHTML;
        tagsContainer = card.node.getElementsByClassName("tags-container")[0];
    }
    return tagsContainer;
}

getCardText = function(card) {
    return card.node.getElementsByClassName("js-card-name")[0].innerHTML;
}

setCardText = function(card, text) {
    card.node.getElementsByClassName("js-card-name")[0].innerHTML = text;
}

addTag = function(card, tagText, iconName) {
    tagsContainer = getTagsContainer(card);

    tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerHTML = awesomeIcon(iconName).outerHTML;
    tag.innerHTML += " " + tagText;

    tagsContainer.innerHTML += tag.outerHTML;
}

processTag = function(card, reg, iconName) {
    cardText   = getCardText(card);
    regexMatch = reg.exec(cardText);
    if (!regexMatch) {
        return;
    }

    cardScore = regexMatch[1];
    setCardText(card, cardText.replace(regexMatch[0], ""));
    addTag(card, cardScore, iconName);
}

cleanTags = function(card) {
    getTagsContainer(card).innerHTML = "";
}

cleanCard = function(card) {
    setCardText(card, card.text);
    cleanTags(card);
}

processList = function(list) {
    scoreMatcher   = new RegExp(/\((.*)\)/g);
    hashtagMatcher = new RegExp(/\#([a-zA-Z]+)/g);
    for (var i = 0; i < list.cards.length; i++)
    {
        processTag(list.cards[i], scoreMatcher, "trophy");
        processTag(list.cards[i], hashtagMatcher, "tag");
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

    console.log("Reloading...");
    setTimeout(main, 2500);
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
            card.node.innerHTML += newTagContainer().outerHTML;

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
