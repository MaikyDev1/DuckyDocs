import {fetcher} from "@/app/api/fetcher";

/**
 * This function will perform a commit to all pages. And clear the database
 * @param project
 * @returns {Promise<void>}
 */
export async function commitAll(project) {

}

function getProjectPages(project) {
  const prefix = `p-${project}|`;
  const keys = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && key.startsWith(prefix)) {
      keys.push(key);
    }
  }

  return keys;
}

export function savePageToCache(newPage, project, category, page) {
  const key = `p-${project}|${category}|${page}`;

  localStorage.setItem(key, JSON.stringify({
    modified: true,
    data: newPage
  }));

}

export async function getPage(project, category, page) {
  const key = `p-${project}|${category}|${page}`;

  if (localStorage.getItem(key) !== null)
    return JSON.parse(localStorage.getItem(key)).data;

  const fetchedPage = await fetcher(`/api/v1/documents/get/${project}/${category}/${page}`);

  let renderData = {};
  fetchedPage.elements.forEach (e => {
    if (!renderData[e.parent]) renderData[e.parent] = [];
    renderData[e.parent].push(e);
  })
  localStorage.setItem(key, JSON.stringify({
    modified: false,
    data: renderData
  }));
  return renderData;
}