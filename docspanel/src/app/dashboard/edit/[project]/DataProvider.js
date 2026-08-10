import {fetcher} from "@/app/api/fetcher";

/**
 * This function will perform a commit to all pages. And clear the database
 * @param project
 * @returns {Promise<void>}
 */
export async function commitAll(project) {
  const categories = getProjectEntries(project);
  for (const category of categories) {
    const content = category.content;
    if (!content.modified) continue;

    const elements = Object.values(content.data).flat();

    let payload = {
      document: project,
      category: category.category,
      page: content.original_slug,

      new_slug: category.page,
      new_title: content.name,
      new_icon: content.icon,
      new_order: content.order,

    }
    if (elements.length > 0) {
      payload.elements = elements;
    }
    await fetcher("/api/v1/docs/writer/page/commit", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }
}

function getProjectEntries(project) {
  const prefix = `p-${project}|`;

  return Object.keys(localStorage)
    .filter(key => key.startsWith(prefix))
    .map(key => {
      const [projectPart, category, page] = key.split("|");

      return {
        project: projectPart.substring(2),
        category,
        page,
        content: JSON.parse(localStorage.getItem(key))
      };
    });
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

export function addNewCategory(project, category, icon, title, order = null) {
  alert("OK!");
  const key = `s-${project}`;
  const cached = localStorage.getItem(key);

  if (cached === null) return false;

  const data = JSON.parse(cached);
  data.categories.push({
    modified: true,
    slug: category, name: title, icon: icon,
    order: order ?? (Math.max(-1, ...data.categories.map(c => c.order)) + 1),
    pages: [],
  })
  console.log(data);
  localStorage.setItem(key, JSON.stringify(data));
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
    icon: icon,
    data: [],
  }
  localStorage.setItem(key, JSON.stringify(final));

  const cached = localStorage.getItem(`s-${project}`);

  if (cached === null) return false;

  const skeleton = JSON.parse(cached);
  const cat = skeleton.categories.find(c => c.slug === category);
  if (!cat) return false;

  cat.pages.push({
    slug: page,
    name: title,
    icon: icon,
    order: order ?? (Math.max(-1, ...cat.pages.map(p => p.order)) + 1),
    modified: true,
  });

  localStorage.setItem(`s-${project}`, JSON.stringify(skeleton));

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