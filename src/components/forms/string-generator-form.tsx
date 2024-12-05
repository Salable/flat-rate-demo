'use client'
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {LockIcon} from "@/components/icons/lock-icon";
import LoadingSpinner from "@/components/loading-spinner";
import {generateString} from "@/app/actions/strings";
import {toast} from "react-toastify";

export type Bytes = '16' | '32' | '64' | '128'
export type LicenseCheckResponse = {
  capabilities: string[],
  publicHash: string,
  signature: string,
  capsHashed: string,
  capabilitiesEndDates: Record<string, string>
}

export const StringGeneratorForm = ({check}: {check: LicenseCheckResponse | null}) => {
  const [randomString, setRandomString] = useState<string | null>(null)
  const {register, handleSubmit, watch, formState: {isSubmitting}} = useForm<{
    bytes: Bytes
  }>({
    ...(check && {defaultValues: {bytes: '16'}}),
    mode: 'onChange'
  })

  const onSubmit: SubmitHandler<{
    bytes: Bytes
  }> = async (formData) => {
    const randomString = await generateString(formData)
    if (typeof randomString === 'string') {
      setRandomString(randomString)
    } else {
      toast.error(randomString.error)
    }
  }

  const bytes: Bytes[] = ['16', '32', '64', '128']

  const Byte = ({size, capability}: {size: string; capability: boolean}) => {
    return (
      <>
        <label
          htmlFor={size}
          className={`p-3 inline-flex items-center leading-none border-2 mr-2 rounded-md
            ${watch().bytes === size ? "border-black bg-black text-white" : ""}
            ${capability ? "cursor-pointer" : ""}
            ${!capability ? "bg-gray-200" : ""}
          `}
        >
          {size}
          {!capability ? (
            <div className='ml-1'><LockIcon height={14} width={14} fill='black'/></div>
          ) : null}
        </label>
        <input disabled={!capability} id={size} type="radio" value={size} {...register('bytes')}
               className='hidden'/>
      </>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-center items-center'>
          <h2 className='text-center mr-3'>Bytes</h2>
          {bytes.map((byte, index) => (
            <Byte size={byte} capability={!!check?.capabilitiesEndDates[byte]} key={`${byte}-${index}`} />
          ))}

          {check ? (
            <button
              className={`p-3 text-white rounded-md leading-none bg-blue-700 hover:bg-blue-900 transition text-sm`}
              disabled={isSubmitting}
            >{!isSubmitting ? "Generate" :
              <div className='w-[15px]'><LoadingSpinner fill="white"/></div>}</button>
          ) : null}

        </div>
      </form>

      {randomString ? (
        <div className='mt-6 relative text-center flex justify-center'>
          <pre
            className='p-2 leading-none truncate text-lg text-center bg-white rounded-l-full'>{randomString}</pre>
          <button
            className='rounded-r-full bg-blue-700 hover:bg-blue-900 transition uppercase px-2 pr-[12px] text-white text-xs'
            onClick={() => navigator.clipboard.writeText(randomString)}
          >
            Copy
          </button>
        </div>
      ) : null}
    </div>
  )
}
