import { Button, Image } from "@nextui-org/react";
import Modal from "./Modal";
import { ChangeEvent, useEffect, useState } from "react";
import { getBase64 } from "@/libs/utils";

interface EditProfilePictureModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function EditProfilePictureModal({
  isOpen,
  onOpenChange,
  onClose,
}: EditProfilePictureModalProps) {
  const [data, setData] = useState<{ file: File | null; url: string | null }>({
    file: null,
    url: null,
  });

  useEffect(() => {
    if (!isOpen) return;
    return () => {
      setData({ file: null, url: null });
    };
  }, [isOpen]);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await getBase64(file);
    setData({ file, url });
    e.target.value = "";
  }

  async function handleClick() {
    if (!data.file) return;
    // 프로필 사진 변경 로직
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      headerContent="프로필 사진 수정"
      footerContent={
        <Button color="primary" onClick={handleClick}>
          수정
        </Button>
      }
    >
      <div className="flex justify-center items-center aspect-square">
        <label
          className="w-full h-full rounded-full border border-dashed border-gray-400 cursor-pointer relative"
          htmlFor="profile-picture"
        >
          <Image
            src={data.url || ""}
            alt="썸네일"
            className="w-full h-full object-cover cursor-pointer rounded-full"
            classNames={{ wrapper: "absolute inset-2" }}
          />
        </label>
        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
}
