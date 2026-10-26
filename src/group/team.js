// GAA Group team. Shown on the shared About page without company tags (client request).
// TODO(client): fill in "native" (native place) for every person. Until filled,
// the card shows "Native place to be updated".
// TODO(client): add each person's LinkedIn profile URL ("linkedin") and work email ("email").
//   Until added, the LinkedIn icon opens a LinkedIn search for the name and the mail icon
//   writes to the GAA Group enquiries inbox with the person's name in the subject.
// Photos: ./team/<id>.jpg (light background) and ./cutouts/<id>.webp (transparent cut-out).
const photos = import.meta.glob("./team/*.jpg", { eager: true, import: "default" });
const cutouts = import.meta.glob("./cutouts/*.webp", { eager: true, import: "default" });
const photo = (id) => photos[`./team/${id}.jpg`];
const cutout = (id) => cutouts[`./cutouts/${id}.webp`];

const PEOPLE = [
  { id: "rose-agarwal", name: "Rose Agarwal", role: "Associate Partner - Corporate Secretarial", native: "", linkedin: "", email: "", lead: true },
  { id: "chetana-n-s", name: "Chetana N S", role: "HR - Director", native: "", linkedin: "", email: "", lead: true },
  { id: "apoorva-g", name: "Apoorva G", role: "Finance Lead", native: "", linkedin: "", email: "", lead: true },
  { id: "m-mahesh", name: "M Mahesh", role: "Accounts - Lead", native: "", linkedin: "", email: "", lead: true },
  { id: "athira-augustine", name: "Athira Augustine", role: "Audit - Lead", native: "", linkedin: "", email: "", lead: true },
  { id: "likith-v-gowda", name: "Likith V Gowda", role: "Senior Associate - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "rajat-raghuvanshi", name: "Rajat Raghuvanshi", role: "Senior Associate - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "deepak-cs", name: "Deepak CS", role: "Senior Associate - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "khushbu-chand-suresh", name: "Khushbu Chand Suresh", role: "Senior Associate - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "sethulakshmi", name: "Sethulakshmi", role: "Senior Associate - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "sarika-s", name: "Sarika S", role: "Associate - Corporate Legal", native: "", linkedin: "", email: "", lead: false },
  { id: "deepak-m", name: "Deepak M", role: "Senior Accounts Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "prajwal-k", name: "Prajwal k", role: "Accounts Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "lohith-r", name: "Lohith R", role: "Accounts Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "sagar-bk", name: "Sagar BK", role: "Finance Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "maria-chethan", name: "Maria chethan", role: "Finance Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "sushma-mathad", name: "Sushma Mathad", role: "Accounts Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "ruthick", name: "Ruthick", role: "Accounts Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "anusha-k-p", name: "Anusha K P", role: "Audit Assistant", native: "", linkedin: "", email: "", lead: false },
  { id: "samhitha", name: "Samhitha", role: "Corporate Co-ordination & Integration Executive", native: "", linkedin: "", email: "", lead: false },
  { id: "ruchitha-pujari", name: "Ruchitha Pujari", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "harsh-kumar-a", name: "Harsh Kumar A", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "abhishek-gupta", name: "Abhishek Gupta", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "divya-jain", name: "Divya Jain", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "tanu-shree", name: "Tanu Shree", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "akansha", name: "Akansha", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "hema", name: "Hema", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "shashank-choube", name: "Shashank Choube", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "ishu-nagar", name: "Ishu Nagar", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "harshit-nagar", name: "Harshit Nagar", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "aniket-sahu", name: "Aniket Sahu", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
  { id: "mansi-a", name: "Mansi A", role: "Trainee - Corporate Secretarial", native: "", linkedin: "", email: "", lead: false },
];

export const TEAM = PEOPLE.map((p) => ({ ...p, image: photo(p.id), cutout: cutout(p.id) }));
export const LEADERS = TEAM.filter((p) => p.lead);
export const MEMBERS = TEAM.filter((p) => !p.lead);
