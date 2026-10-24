import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";

function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const create = (data) => console.log(data);

  return (
    /* Modal Backdrop with Blur */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Modal Container matching Midnight Cobalt Theme */}
      <div className="relative w-full max-w-lg p-8 bg-[#161E2E] border border-gray-800 rounded-2xl shadow-2xl text-white">
        
        {/* Close Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold cursor-pointer"
          aria-label="Close"
        >
          &times;
        </button>

        <h1 className="text-3xl font-bold font-serif">
          Welcome to Stream<span className="text-yellow-500">Tube</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Create your account to upload, subscribe and comment.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(create)} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" {...register("firstName", { required: true })} />
            <Input label="Last name" {...register("lastName", { required: true })} />
          </div>
          
          <Input label="Username" {...register("username", { required: true })} />
          <Input label="Email" type="email" {...register("email", { required: true })} />
          <Input label="Password" type="password" {...register("password", { required: true, minLength: 8 })} />

          {Object.keys(errors).length > 0 && (
            <div role="alert" className="text-sm text-red-400">
              Please fill every field (password: 8+ characters).
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;