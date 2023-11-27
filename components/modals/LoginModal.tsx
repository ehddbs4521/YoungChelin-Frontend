import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

interface LoginForm {
  email: string;
  emailAddress: string;
  password: string;
  passwordConfirm: string;
}

enum Mode {
  LOGIN,
  SIGN_UP,
  AFTER_SIGN_UP,
  FIND_PW,
  ISSUE_PW,
}

const texts = {
  0: ["로그인", "로그인"],
  1: ["회원가입", "회원가입"],
  2: ["가입이 완료되었습니다.", "확인"],
  3: ["비밀번호 찾기", "비밀번호 찾기"],
  4: ["임시 비밀번호 발급", "확인"],
};

export default function LoginModal({
  isOpen,
  onOpenChange,
  onClose,
}: LoginModalProps) {
  const [mode, setMode] = useState<Mode>(Mode.LOGIN);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<LoginForm>();

  function onValid({
    email,
    emailAddress,
    password,
    passwordConfirm,
  }: LoginForm) {
    const combinedEmail = `${email}@${emailAddress}`;

    switch (mode) {
      case Mode.LOGIN:
        // 로그인 로직
        break;
      case Mode.SIGN_UP:
        // 회원가입 로직
        setMode(Mode.AFTER_SIGN_UP);
        break;
      case Mode.FIND_PW:
        // 임시 비밀번호 발급 로직
        setMode(Mode.ISSUE_PW);
        break;
    }
  }

  useEffect(() => {
    return () => {
      setMode(Mode.LOGIN);
      reset();
    };
  }, [isOpen, reset]);

  let bodyContent = (
    <>
      <form className="space-y-3" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center">
          <Input
            {...register("email", { required: true })}
            autoFocus
            label="이메일"
            variant="bordered"
            isInvalid={!!errors.email}
          />
          <span className="mx-2 text-gray-400">@</span>
          <Select
            {...register("emailAddress", { required: true })}
            variant="bordered"
            label="주소 선택"
            className="w-52"
            isInvalid={!!errors.emailAddress}
          >
            {["yu.ac.kr", "ynu.kr"].map((addr) => (
              <SelectItem key={addr} value={addr}>
                {addr}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Input
          {...register("password", { required: true })}
          type="password"
          label="비밀번호"
          variant="bordered"
          isInvalid={!!errors.password}
        />
        {mode === Mode.SIGN_UP ? (
          <Input
            {...register("passwordConfirm", { required: true })}
            type="password"
            label="비밀번호 확인"
            variant="bordered"
            isInvalid={!!errors.passwordConfirm}
          />
        ) : null}
        <Button type="submit" className="w-full">
          {texts[mode][1]}
        </Button>
      </form>
      <div className="py-2 flex justify-end items-center text-sm text-gray-500 gap-6">
        {mode === Mode.LOGIN ? (
          <>
            <div
              className="cursor-pointer"
              onClick={() => setMode(Mode.SIGN_UP)}
            >
              회원가입
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setMode(Mode.FIND_PW)}
            >
              비밀번호 찾기
            </div>
          </>
        ) : mode === Mode.SIGN_UP ? (
          <div className="cursor-pointer" onClick={() => setMode(Mode.LOGIN)}>
            로그인
          </div>
        ) : null}
      </div>
    </>
  );

  if (mode === Mode.AFTER_SIGN_UP) {
    bodyContent = (
      <>
        <div>이메일을 통해 본인인증을 완료해 주시기 바랍니다.</div>
        <Button className="my-3" onClick={onClose}>
          {texts[mode][1]}
        </Button>
      </>
    );
  }

  if (mode === Mode.FIND_PW) {
    bodyContent = (
      <>
        <form className="space-y-3 mb-6">
          <div className="flex items-center">
            <Input
              {...register("email", { required: true })}
              autoFocus
              label="이메일"
              variant="bordered"
              isInvalid={!!errors.email}
            />
            <span className="mx-2 text-gray-400">@</span>
            <Select
              {...register("emailAddress", { required: true })}
              variant="bordered"
              label="주소 선택"
              className="w-52"
              isInvalid={!!errors.emailAddress}
            >
              {["yu.ac.kr", "ynu.kr"].map((addr) => (
                <SelectItem key={addr} value={addr}>
                  {addr}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit(onValid)}
          >
            {texts[mode][1]}
          </Button>
        </form>
      </>
    );
  }

  if (mode === Mode.ISSUE_PW) {
    bodyContent = (
      <>
        <div>해당 이메일로 임시 비밀번호가 발급되었습니다.</div>
        <Button className="my-3" onClick={onClose}>
          {texts[mode][1]}
        </Button>
      </>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      headerContent={texts[mode][0]}
    >
      {bodyContent}
    </Modal>
  );
}
