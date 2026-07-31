import {fetcher} from "@/app/api/fetcher";

/**
 * This function will perform a commit to all pages. And clear the database
 * @param project
 * @returns {Promise<void>}
 */
export async function commitAll(project) {

}

export async function getSkeleton(project) {
  const key = `s-${project}`;
  const cached = localStorage.getItem(key);

  if (cached !== null) {
    const data = JSON.parse(cached);

    data.categories.sort((a, b) => a.order - b.order);

    data.categories.forEach(c =>
      c.pages.sort((a, b) => a.order - b.order)
    );

    return data;
  }

  const fetchedPage = await fetcher(`/api/v1/documents/skeleton/${project}`);

  let data = {
    project: {
      access: fetchedPage.access,
      slug: fetchedPage.slug,
      name: fetchedPage.name,
      icon: fetchedPage.icon,
    },
    categories: []
  };

  fetchedPage.categories.forEach(el => {
    data.categories.push({...el, modified: false, original_slug: el.slug});
  });
  localStorage.setItem(key, JSON.stringify(data));

  return fetchedPage;

}

export function changePageInSkeleton(project, category, page, updates) {
  const key = `s-${project}`;

  const current = JSON.parse(localStorage.getItem(key));

  if (!current) {
    return false;
  }

  const cat = current.categories.find(c => c.slug === category);

  if (!cat) {
    return false;
  }

  cat.pages = cat.pages.map(p =>
    p.slug === page
      ? { ...p, ...updates, modified: true }
      : p
  );

  localStorage.setItem(key, JSON.stringify(current));

  return true;

}

export function createNewPage(project, category, page, icon, title, order) {
  const key = `p-${project}|${category}|${page}`;
  const final = {
    modified: true,
    slug: page,
    original_slug: page,
    name: title,
    order: order,
    icon: icon,
    data: [],
  }
  localStorage.setItem(key, JSON.stringify(final));
}

export function savePageToCache(newPage, project, category, page) {
  const key = `p-${project}|${category}|${page}`;

  localStorage.setItem(key, JSON.stringify({
    ...JSON.parse(localStorage.getItem(key)),
    modified: true,
    data: newPage
  }));

}

export async function changePageDetails(project, category, page, updates) {
  const key = `p-${project}|${category}|${page}`;
  const cache = localStorage.getItem(key);
  const current = cache === null ? await getPage(project, category, page) : JSON.parse(cache);

  const newSlug = updates.slug ?? page;

  const newObject = {
    ...current,
    ...updates,
    modified: true
  }

  changePageInSkeleton(project, category, page, updates);

  if (newSlug === page) {
    localStorage.setItem(key, JSON.stringify(newObject));
  } else {
    localStorage.removeItem(key);
    localStorage.setItem(`p-${project}|${category}|${newSlug}`, JSON.stringify(newObject));
  }
}

export async function getPage(project, category, page) {
  const key = `p-${project}|${category}|${page}`;

  if (localStorage.getItem(key) !== null)
    return JSON.parse(localStorage.getItem(key));

  const fetchedPage = await fetcher(`/api/v1/documents/get/${project}/${category}/${page}`);

  let renderData = {};
  fetchedPage.elements.forEach (e => {
    if (!renderData[e.parent]) renderData[e.parent] = [];
    renderData[e.parent].push(e);
  })

  const final = {
    modified: false,
    slug: page,
    original_slug: page,
    name: fetchedPage.name,
    order: fetchedPage.order,
    icon: fetchedPage.icon,
    data: renderData
  }
  localStorage.setItem(key, JSON.stringify(final));
  return final;
}