export interface Student {
  name: string;
  department: string;
  avatar: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  student: Student;
  year: number;
}
