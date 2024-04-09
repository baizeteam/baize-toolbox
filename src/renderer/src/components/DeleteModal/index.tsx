import React, { useState } from "react";
import { Modal, Checkbox, ModalProps } from "antd";
import { useTranslation } from "react-i18next";

interface IDeleteModalProps extends Omit<ModalProps, "onOk"> {
  onOk: (data: { path: string; isDeleteFile: boolean }) => void;
  path: string;
}

export default function DeleteModal(props: IDeleteModalProps) {
  const { path, onOk } = props;
  const [value, setValue] = useState(false);
  const { t } = useTranslation();

  const _onOk = () => {
    onOk({
      path,
      isDeleteFile: value,
    });
  };
  return (
    <Modal {...props} title={t("components.deleteModal.content")} onOk={_onOk}>
      <Checkbox value={value} onChange={(e) => setValue(e.target.checked)}>
        {t("components.deleteModal.deleteFileText")}
      </Checkbox>
    </Modal>
  );
}
