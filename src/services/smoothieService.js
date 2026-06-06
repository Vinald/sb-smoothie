import supabase from "../config/supabaseClient";

export const fetchSmoothies = ({ page, pageSize, ratingFilter }) => {
  let query = supabase
    .from("smoothie")
    .select("*", { count: "exact" })
    .eq("voided", false)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (ratingFilter !== "all") {
    query = query.eq("rating", Number(ratingFilter));
  }

  return query;
};

export const fetchSmoothieById = (id) =>
  supabase.from("smoothie").select().eq("id", id).single();

export const createSmoothie = (data) =>
  supabase.from("smoothie").insert([data]);

export const updateSmoothie = (id, data) =>
  supabase.from("smoothie").update(data).eq("id", id);

export const voidSmoothie = (id) =>
  supabase.from("smoothie").update({ voided: true }).eq("id", id);
