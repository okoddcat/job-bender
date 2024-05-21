class ElementFinder {
    regexValues;
    constructor() {
        this.allElements = document.getElementsByTagName("*");
        this.count = 0;
    }
    findClosestInputElement(element) {
        let $element = $(element);
        let $ancestor = $element.parent();
        let loopCount = 0;
        while (loopCount < 5 && $ancestor.length > 0 && $ancestor.find("input").length === 0) {
            $ancestor = $ancestor.parent();
            loopCount++;
        }
        let $closestInput = $ancestor.find("input");
        if ($closestInput.length != 1) {
            return null;
        }
        return $closestInput;
    }
    matchRegexAndSetValue(element) {
        let textContent = element.textContent.trim();
        for (let i = 0; i < this.regexValues.length; i++) {
            let regexValue = this.regexValues[i];
            let regex = new RegExp(regexValue.regex, "i");
            if (regex.test(textContent)) {
                let closestInputElement = this.findClosestInputElement(element);
                if (closestInputElement) {
                    closestInputElement.val(regexValue.value);
                    closestInputElement.trigger("input");
                    this.count++;
                } else {
                    console.log("No input element found: " + regexValue.name);
                }
                break;
            }
        }
    }
    searchElements() {
        for (let i = 0; i < this.allElements.length; i++) {
            let element = this.allElements[i];
            let childElements = element.getElementsByTagName("*");
            if (element.textContent.trim().length < 20) {
                if (childElements.length < 1) {
                    this.matchRegexAndSetValue(element);
                } else if (childElements.length < 2) {
                    this.matchRegexAndSetValue(element);
                } else if (childElements.length < 3) {
                    this.matchRegexAndSetValue(element);
                }
            }
        }
    }
}
class Operator {
    constructor(finder) {
        this.finder = finder;
    }
    dataURLToBlob(dataURL) {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime,
        });
    }
    fill() {
        chrome.storage.local.get(["profile"], (result) => {
            let regexValues = [{
                name: "first name",
                regex: "\\bfirst[\\s_-]*name\\b",
                value: result.profile.firstName,
            }, {
                name: "last name",
                regex: "\\blast[\\s_-]*name\\b",
                value: result.profile.lastName,
            }, {
                name: "full name",
                regex: "\\bfull[\\s_-]*name\\b",
                value: [result.profile.firstName, result.profile.lastName].filter(Boolean).join(" "),
            }, {
                name: "email",
                regex: "\\bemail\\b",
                value: result.profile.email,
            }, {
                name: "phone",
                regex: "\\phone\\b",
                value: result.profile.phone,
            }, {
                name: "salary",
                regex: "\\bsalary\\b",
                value: result.profile.salary,
            }, {
                name: "location",
                regex: "\\bcity|location\\b",
                value: result.profile.location,
            }, ];
            console.log(this.finder)
            this.finder.regexValues = regexValues;
            this.finder.searchElements();
            if (this.finder.count > 2) {
                this.fillResume()
            }
        });
    }
    fillResume() {
        chrome.storage.local.get(["resume"], (result) => {
            const fileInput = document.querySelector("input[type=file]");
            const metadata = {
                type: result.resume.type,
            };
            const blob = this.dataURLToBlob(result.resume.content);
            const file = new File([blob], result.resume.name, metadata);
            const fileList = new DataTransfer();
            fileList.items.add(file);
            if (fileInput) {
                fileInput.files = fileList.files;
                const event = new Event("change", {
                    bubbles: true
                });
                fileInput.dispatchEvent(event);
            }
            console.log(fileInput.files);
        });
    }
}
let operator = new Operator(new ElementFinder());
operator.fill();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.message === "fill") {
        operator.fill();
    }
});