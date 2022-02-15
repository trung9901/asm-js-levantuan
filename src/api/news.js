import instance from "./config";

const TABLE_NAME = "news";

export const getAll = (start, limit = 0) => {
    let url = `/${TABLE_NAME}/?_sort=id&_order=desc`;
    if (limit) url += `&_start=${start}&_limit=${limit}`;
    return instance.get(url);
};

// ds bài viết ở trạng thái hiển thị
export const getAllShow = () => {
    const url = `/${TABLE_NAME}/?status_ne=0&_sort=id&_order=desc`;
    return instance.get(url);
};

export const get = (id) => {
    const url = `/${TABLE_NAME}/${id}/?_expand=cateNew`;
    return instance.get(url);
};

export const getRelated = (id, cateId) => {
    const url = `/${TABLE_NAME}/?status_ne=0&id_ne=${id}&cateNewId=${cateId}`;
    return instance.get(url);
};

export const add = (data) => {
    const url = `/${TABLE_NAME}`;
    return instance.post(url, data);
};

export const remove = (id) => {
    const url = `/${TABLE_NAME}/${id}`;
    return instance.delete(url);
};

export const update = (id, data) => {
    const url = `/${TABLE_NAME}/${id}`;
    return instance.patch(url, data);
};

// tin tức theo danh mục
export const getAllByCate = (cateId, start, limit = 0) => {
    let url = `/${TABLE_NAME}/?cateNewId=${cateId}`;
    if (limit) url += `&_start=${start}&_limit=${limit}`;
    return instance.get(url);
};