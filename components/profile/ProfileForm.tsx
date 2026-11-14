'use client';

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import InputField from "@/components/forms/InputField";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import { updateProfile, type ProfileInput } from "@/lib/actions/profile.actions";

export default function ProfileForm({ initial }: { initial: ProfileInput }) {
    const t = useTranslations('ProfileForm');
    const tPrefs = useTranslations('PreferenceFields');
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<ProfileInput>({
        defaultValues: initial,
        mode: 'onBlur',
    });

    const onSubmit = async (values: ProfileInput) => {
        const result = await updateProfile(values);
        if (!result.success) {
            toast.error(t('saveFailed'), { description: result.error });
            return;
        }
        toast.success(t('saved'));
        reset(values);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-4">
            <InputField
                name="name"
                label={t('nameLabel')}
                placeholder={t('namePlaceholder')}
                register={register}
                error={errors.name}
                validation={{ required: t('nameRequired'), minLength: { value: 2, message: t('nameMinLength') } }}
            />
            <CountrySelectField name="country" label={tPrefs('country')} control={control} error={errors.country} required />
            <div className="flex items-center gap-3 pt-1">
                <button type="submit" disabled={isSubmitting || !isDirty} className="btn btn-primary">
                    {isSubmitting ? t('submitting') : t('submit')}
                </button>
                {!isDirty && <span className="text-[13px] text-faint">{t('upToDate')}</span>}
            </div>
        </form>
    );
}
