import UpdatePasswordForm from "./UpdatePasswordForm";

export default function UpdatePage() {
  return (
    <main className="w-full grow flex flex-col items-center">
      <div className="w-72 flex flex-col gap-4 text-center">
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
