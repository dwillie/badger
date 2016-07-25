// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get("badgerConfig", function(item) {
        if (Object.keys(item).length === 0) {
            var defaultConfig = {
                cardBadges: [
                    {
                        name: "ID",
                        field: "id",
                        icon: "globe",
                        regex: "#([0-9]+)",
                        textColor: "#fff",
                        bgColor: "#669999",
                        fontSize: "smaller",
                        fontWeight: "400"
                    },
                    {
                        name: "Dependency",
                        field: "dependency",
                        icon: "asterisk",
                        regex: "d\\(([0-9^\\)]+)\\)",
                        textColor: "#fff",
                        bgColor: "#BC5544",
                        fontSize: "smaller",
                        fontWeight: "400"
                    },
                    {
                        name: "Score",
                        field: "score",
                        icon: "trophy",
                        regex: "\\(([0-9^\\)]+)\\)",
                        textColor: "#fff",
                        bgColor: "#55BB55",
                        fontSize: "smaller",
                        fontWeight: "400"
                    },
                    {
                        name: "Tags",
                        field: "tags[]",
                        icon: "tag",
                        regex: "#([a-zA-Z]+)",
                        textColor: "#fff",
                        bgColor: "func",
                        fontSize: "smaller",
                        fontWeight: "400"
                    },
                    {
                        name: "Days Estimate",
                        field: "daysEstimate",
                        icon: "calendar",
                        regex: "~([0-9]+)",
                        textColor: "#fff",
                        bgColor: "#BB6666",
                        fontSize: "smaller",
                        fontWeight: "400"
                    }
                ],
                listBadges: [
                    {
                        name: "Total Score",
                        field: "totalScore",
                        icon: "trophy",
                        textColor: "#55BB55",
                        bgColor: "none",
                        fontSize: "16px",
                        fontWeight: "300",
                        reduce: (function(previousValue, currentValue, index, array) {
                            if (!currentValue.score) {
                                return previousValue;
                            } else {
                                return previousValue + parseInt(currentValue.score, 10);
                            }
                        }).toString(),
                        reduceInit: 0
                    },
                    {
                        name: "Total Time",
                        field: "length",
                        icon: "calendar",
                        textColor: "#BB6666",
                        bgColor: "none",
                        fontSize: "12px",
                        fontWeight: "300",
                        reduce: (function(previousValue, currentValue, index, array) {
                            var result;
                            if (!currentValue.daysEstimate) {
                                result = previousValue;
                            } else {
                                result  = previousValue + parseInt(currentValue.daysEstimate, 10);
                            }
                            if (index == array.length - 1) {
                                if (result > 5) {
                                    return '' + Math.floor(result / 5) + ' weeks and ' + result % 5 + ' days.';
                                } else if (result > 0) {
                                    return '' + result + ' days.';
                                } else {
                                    return 0;
                                }
                            }
                            return result;
                        }).toString(),
                        reduceInit: 0
                    }
                ]
            };

            chrome.storage.sync.set({ "badgerConfig": JSON.stringify(defaultConfig, undefined, "  ") });
        }
    });
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'trello.com/b/' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
