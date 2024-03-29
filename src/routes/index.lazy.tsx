import {
  ActionIcon,
  Button,
  Flex,
  Modal,
  Text,
  TextInput
} from "@mantine/core";
import { mdiArrowLeft, mdiHome, mdiStar } from "@mdi/js";
import Icon from "@mdi/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import DisplayModeToggle from "../components/display-mode/DisplayModeToggle";
import FileList from "../components/file-list/FileList";
import TileItem from "../components/file-list/item-views/tile-item/TileItem";
import displayModeStore from "../stores/displayMode.store";
import pathStore from "../stores/path.store";
import type { FileInList } from "../types/FileInList.type";
import { usePathInput } from "../utils/usePathInput";
import css from "./index.module.css";

export const Route = createLazyFileRoute("/")({
  component: Index
});

function Index() {
  const { path, setPath, setPathDebounced, goBack, inputRef } =
    usePathInput(pathStore);

  const displayMode = useStore(displayModeStore);
  const [openFile, setOpenFile] = useState<FileInList | null>(null);

  const dir = useQuery({
    queryKey: ["list_files", path],
    queryFn: async () => {
      return await invoke<FileInList[]>("list_files", { dir: path });
    },
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: 1000
  });

  const onClickPath = (file: FileInList) => {
    if (file.isDir) {
      setPath(file.path);
    } else {
      console.log("Open file", file.path);
      setOpenFile(file);
    }
  };

  return (
    <>
      <nav className={css.actionBar}>
        <Button
          leftSection={<Icon path={mdiHome} size={1} />}
          variant="light"
          onClick={() => setPath("/")}
          style={{ flexShrink: 0 }}
        >
          Home
        </Button>
        <ActionIcon aria-label="Go back" variant="transparent" onClick={goBack}>
          <Icon path={mdiArrowLeft} size={1} />
        </ActionIcon>
        {/* <Autocomplete
          label="Your favorite library"
          placeholder="Pick value or enter anything"
          data={['React', 'Angular', 'Vue', 'Svelte']}
        /> */}
        <TextInput
          placeholder="Folder"
          ref={inputRef}
          defaultValue={path}
          onChange={(event) => setPathDebounced(event.currentTarget.value)}
          error={
            dir.failureCount > 0
              ? `Can't read directory. ${dir.failureCount}/3 times. ${dir.error || ""}`
              : ""
          }
        />
        <ActionIcon aria-label="Favourite" variant="transparent" disabled>
          <Icon path={mdiStar} size={1} />
        </ActionIcon>
        <Flex ml="auto">
          <DisplayModeToggle
            value={displayMode}
            setValue={(val) => displayModeStore.setState(() => val)}
          />
        </Flex>
      </nav>

      {dir.isPending && <Text>Loading...</Text>}
      {dir.isError && <Text c="red">Error: {dir.error?.message}</Text>}

      {dir.data && (
        <FileList
          paths={dir.data}
          onClickPath={onClickPath}
          displayMode={displayMode}
        />
      )}

      {openFile && (
        <Modal
          opened={!!openFile}
          onClose={() => setOpenFile(null)}
          title="File"
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}
          size={"xl"}
        >
          <TileItem file={openFile} onClick={() => {}} />
        </Modal>
      )}
    </>
  );
}
