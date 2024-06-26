import { Stack } from "@mantine/core";
import type { FileInList } from "../../types/FileInList.type";
import css from "./FileList.module.css";
import NavLinkItem from "./item-views/NavLinkItem";
import TileItem from "./item-views/tile-item/TileItem";
import { DisplayMode } from "../../stores/displayMode.store";
import { memo } from "react";

type Props = {
  paths: FileInList[];
  onClickPath: (path: FileInList) => void;
  onDelete: (file: FileInList) => void;
  displayMode: keyof typeof DisplayMode;
};

const gridSizes = {
  grid_sm: "250px",
  grid_lg: "400px",
};

const FileList = ({ paths, onClickPath, onDelete, displayMode }: Props) => {
  if (displayMode === "grid_sm" || displayMode === "grid_lg") {
    return (
      <div
        className={css.itemGrid}
        style={{ "--grid-size": gridSizes[displayMode], flex: 1 } as any}
      >
        {paths.map((file) => (
          <TileItem
            key={file.path}
            file={file}
            onClick={onClickPath}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <Stack gap={1} flex={1}>
      {paths.map((file) => (
        <NavLinkItem key={file.path} file={file} onClick={onClickPath} />
      ))}
    </Stack>
  );
};

export default memo(FileList);
