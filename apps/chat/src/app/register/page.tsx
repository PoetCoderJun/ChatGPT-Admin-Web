"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/components/ui-lib";
import { useUserStore } from "@/store";
import { ReturnButton } from "@/components/ui-lib";
import { RegisterResponse, ResponseStatus } from "@/app/api/typing.d";

import Locales from "@/locales";
import styles from "@/app/login/login.module.scss";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [invitationCode, setInvitationCode] = useState(
    searchParams.get("code") ?? ""
  );

  const [submitting, setSubmitting] = useState(false);

  const [updateSessionToken, updateEmail] = useUserStore((state) => [
    state.updateSessionToken,
    state.updateEmail,
  ]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !invitationCode) {
      showToast(Locales.Index.NoneData);
      setSubmitting(false);
      return;
    }

    if (invitationCode != window.btoa(email).substring(0, 5)){
      showToast(Locales.Index.CodeError);
      setSubmitting(false);
      return;
    }

    const res = (await (
      await fetch("/api/user/register", {
        cache: "no-store",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          code_type: "email"
        }),
      })
    ).json()) as RegisterResponse;

    switch (res.status) {
      case ResponseStatus.Success: {
        updateSessionToken(res.sessionToken);
        updateEmail(email);
        router.replace("/");
        showToast(Locales.Index.Success(Locales.Index.Register), 3000);
        break;
      }
      case ResponseStatus.alreadyExisted: {
        showToast(Locales.Index.DuplicateRegistration);
        break;
      }
      default: {
        showToast(Locales.UnknownError);
        break;
      }
    }
  };

  return (
    <div className={styles["login-form-container"]}>
      <form className={styles["login-form"]} onSubmit={handleRegister}>
        <ReturnButton onClick={() => router.push("/enter")} />

        <h2 className={styles["login-form-title"]}>Register</h2>
        <div className={styles["login-form-input-group"]}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles["login-form-input-group"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>


        <div className={styles["login-form-input-group"]}>
          <label htmlFor="email">Invitation Code</label>
          <div className={styles["verification-code-container"]}>
            <input
              type="text"
              id="invitation-code"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
          </div>
        </div>

        <div className={styles["button-container"]}>
          <button className={styles["login-form-submit"]} type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
