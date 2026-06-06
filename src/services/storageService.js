import supabase from "../config/supabaseClient";

export const uploadImage = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("smoothies")
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("smoothies").getPublicUrl(fileName);
  return data.publicUrl;
};
