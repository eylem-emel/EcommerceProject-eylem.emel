import { Linkedin } from "lucide-react";
import gokhanImg from "../assets/gokhan.jpeg";
import emelImg from "../assets/emelprofil.png";
const placeholderImg = "https://placehold.co/160x160/png?text=Photo";

export default function TeamPage() {
  const team = [
    {
      name: "Gökhan Özdemir",
      role: "Project Manager",
      img: gokhanImg, // LinkedIn foto linkini buraya yapıştırabilirsin
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Eylem Emel",
      role: "Full Stack Developer",
      img: emelImg,
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Team Member 1",
      role: "Frontend Developer",
      img: placeholderImg,
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Team Member 2",
      role: "Backend Developer",
      img: placeholderImg,
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Team Member 3",
      role: "UI/UX Designer",
      img: placeholderImg,
      linkedin: "https://www.linkedin.com/",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Team</h1>
        <p className="text-sm text-zinc-600">
          Meet the people building this project.
        </p>
      </div>

      <div className="w-full flex flex-wrap gap-4">
        {team.map((m) => (
          <div
            key={m.name}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex"
          >
            <div className="w-full border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="w-full flex justify-center pt-6">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-zinc-200 bg-white"
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-sm text-zinc-600">{m.role}</div>

                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
