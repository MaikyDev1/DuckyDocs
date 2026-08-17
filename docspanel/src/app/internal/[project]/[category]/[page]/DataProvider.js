import {fetcher} from "@/app/api/fetcher";

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
    data.categories.push(el);
  });
  localStorage.setItem(key, JSON.stringify(data));

  return data;

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
    slug: page,
    name: fetchedPage.name,
    order: fetchedPage.order,
    icon: fetchedPage.icon,
    data: renderData
  }
  localStorage.setItem(key, JSON.stringify(final));
  return final;
}
