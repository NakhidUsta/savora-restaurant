import StoryBanner from '../components/StoryBanner';
import { useSettings } from '../context/SettingsContext';
import { resolveUploadUrl } from '../api/upload';

function About() {
  const { settings } = useSettings();
  const aboutPhoto = resolveUploadUrl(settings.images?.about_image?.url);

  return (
    <>
      <section className="pt-[50px] pb-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <StoryBanner
            title="Hekayəmiz və nailiyyətlərimiz"
            description="20 ildən çoxdur ki, ənənəvi dadı incə xidmətlə birləşdirərək qonaqlarımıza unudulmaz təcrübə yaşadırıq."
            photo={aboutPhoto}
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[760px] mx-auto px-8">
          <div className="text-left mb-5">
            <div className="text-[13px] text-brick font-semibold mb-2.5">Başlanğıc</div>
            <h2 className="text-[26px] sm:text-[34px] font-semibold">Hər şey kiçik bir mətbəxdən başladı</h2>
          </div>
          <p className="text-muted leading-[1.8] text-[15.5px]">
            2004-cü ildə ailəvi reseptlərlə açılan kiçik bir mətbəx bu gün şəhərin sevilən məkanlarından
            birinə çevrilib. Məqsədimiz heç vaxt dəyişməyib: hər boşqabda dürüst, təzə və diqqətlə
            hazırlanmış dad təqdim etmək. Bu gün 26 peşəkar aşpazımız, gündəlik təzələnən
            inqrediyentlərimiz və 1000-dən çox məmnun qonağımızla bu yolda davam edirik.
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
