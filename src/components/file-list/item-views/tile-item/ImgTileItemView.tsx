import { memo } from "react";
import { Text } from "@mantine/core";
import css from "./ImgTileItemView.module.css";
import previewCss from "./PreviewTileItemView.module.css";
import { FileInList } from "../../../../types/FileInList.type";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useIntersectionObserver } from "@uidotdev/usehooks";

type Props = {
  file: FileInList;
  label: string;
};

const ImgTileItemView = (props: Props) => {
  const { file, label } = props;
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "200px"
  });

  const src = entry?.isIntersecting ? convertFileSrc(file.path) : "";

  return (
    <div className={previewCss.tileWrapper}>
      <img src={src} alt="" className={css.filePreviewImg} ref={ref} />
      <Text size="sm" className={previewCss.label} title={label}>
        {label}
      </Text>
    </div>
  );
};

export default memo(ImgTileItemView);
