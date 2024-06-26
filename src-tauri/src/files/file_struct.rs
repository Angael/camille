use serde::ser::SerializeStruct;

pub struct FileInList {
    pub path: String,
    pub is_file: bool,
    pub is_dir: bool,
}

impl FileInList {
    pub fn new(path: String, is_file: bool, is_dir: bool) -> FileInList {
        let normalized_path = path.replace("\\", "/");

        FileInList {
            path: normalized_path,
            is_file,
            is_dir,
        }
    }
}

// impl serde
impl serde::Serialize for FileInList {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("File", 3)?;
        state.serialize_field("path", &self.path)?;
        state.serialize_field("isFile", &self.is_file)?;
        state.serialize_field("isDir", &self.is_dir)?;
        state.end()
    }
}
