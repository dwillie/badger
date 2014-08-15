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
    tagsContainer = card.getElementsByClassName("tags-container")[0];
    if (!tagsContainer) {
        card.innerHTML += newTagContainer().outerHTML;
        tagsContainer = card.getElementsByClassName("tags-container")[0];
    }
    return tagsContainer;
}

getCardText = function(card) {
    return card.getElementsByClassName("js-card-name")[0].innerHTML;
}

setCardText = function(card, text) {
    return card.getElementsByClassName("js-card-name")[0].innerHTML = text;
}

addTag = function(card, tagText) {
    tagsContainer = getTagsContainer(card);

    tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerHTML = awesomeIcon("trophy").outerHTML;
    tag.innerHTML += " " + tagText;

    console.log("Adding tag");
    tagsContainer.innerHTML += tag.outerHTML;
}

processList = function(list) {
    scoreMatcher = new RegExp(/\((.*)\)/g);
    cards = list.getElementsByClassName("list-card");
    for (var i = 0; i < cards.length; i++)
    {
        cardText   = getCardText(cards[i]);
        regexMatch = scoreMatcher.exec(cardText);
        if (regexMatch === null || regexMatch === undefined) {
            continue;
        }

        cardScore  = regexMatch[1];
        setCardText(cards[i], cardText.replace(regexMatch[0], ""));
        addTag(cards[i], cardScore);
    }
}

refreshCycle = function() {
    lists = document.getElementsByClassName("list");
    for (var i = 0; i < lists.length; i++) {
        processList(lists[i]);
    }

    // setTimeout(main, 1000);
}

main = function() {
    loadFontAwesome();
    refreshCycle();
}

window.onload = main
