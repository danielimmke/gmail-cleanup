/**
 * This entire file is considered the "service worker" and it only activates when you
 * go to a page defined in "host_permissions" or if you have the permission "activeTab"
 * Docs: https://developer.chrome.com/docs/extensions/reference/scripting/#manifest
 * 
 * So at the bottom, we are actually adding a listener to the web navigation.
 * When it detects a Gmail page, it fires injectScript which uses the new executeScript API
 * This actually calls the function "modifyInbox", which is where my actual custom code is.
 * At this point, the page and DOM are fully loaded so you don't need to account for that.
 */

/**
 * Important: This actually injects the function into the page itself.
 * So things like console log etc... will actually be in the console
 * for that specific page.
 */
function modifyInbox() {
  try {
    let $accordionImages = document.querySelectorAll(`h3[role="button"] img[src*="/icons/mail/images/cleardot.gif"]`);
  
    for(let $accordionImage of $accordionImages) {
      let $accordionLabel = $accordionImage.nextSibling.firstChild;
      
      $accordionImage.remove();
      
      $accordionLabel.style.fontSize = '.85rem'

      if($accordionLabel.textContent === 'Everything else') $accordionLabel.textContent = 'Inbox';
    
      let $headingh3 = $accordionLabel.parentElement.parentElement;

      $headingh3.style.minWidth = "0px";
    
      let $headingContainer = $headingh3.parentElement.parentElement;

      $headingContainer.style.paddingTop = "0px";
    }
  } catch(err) {
    console.warn('Unable to modify Gmail inbox');
    console.error(err);
  }
}

const injectScript = ({ tabId }) => {
  chrome.scripting
    .executeScript({
      target: { tabId },
      injectImmediately: true,
      func: modifyInbox,
    })
}

/**
 * The following two functions simply hide the page
 * until the modifications have run, so you only see
 * when the new look is applied.
 */
chrome.webNavigation.onCommitted.addListener(
  ({ tabId }) => {
    chrome.scripting.insertCSS({
      target: { tabId },
      css: `body { visibility: hidden; }`
    })
  },
  {url: [
    {hostContains: 'mail.google.com'}
  ]}
)

chrome.webNavigation.onDOMContentLoaded.addListener(
  ({ tabId }) => {
    chrome.scripting.insertCSS({
      target: { tabId },
      css: `body { visibility: unset; }`
    })
  },
  {url: [
    {hostContains: 'mail.google.com'}
  ]}
)

chrome.webNavigation.onDOMContentLoaded.addListener(
  injectScript,
  {url: [
    {hostContains: 'mail.google.com'}
  ]}
)

