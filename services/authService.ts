
import { User, UserRole } from '../types';

const USERS_DB_KEY = 'bandit_users_db';
const SESSION_KEY = 'bandit_auth_session';
const REMEMBER_KEY = 'bandit_remembered_email';

const DEFAULT_CREDENTIALS = [
  { id: 'c1', label: 'Verified Pilot', icon: 'fa-certificate', issueDate: 'Jan 2024' },
  { id: 'c2', label: 'Heavy Hauler', icon: 'fa-truck-ramp-box', issueDate: 'Mar 2024' },
  { id: 'c3', label: 'Safety First', icon: 'fa-shield-heart', issueDate: 'Feb 2024' }
];

const DEFAULT_REVIEWS = [
  { id: 'r1', customerName: 'Sarah J.', rating: 5, comment: 'Incredibly fast and professional. The package arrived in perfect condition!', date: '2 days ago' },
  { id: 'r2', customerName: 'Mike R.', rating: 5, comment: 'Always a pleasure shipping with this rider. Highly recommended!', date: '1 week ago' }
];

export const authService = {
  signup: (name: string, email: string, role: UserRole, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return null;
    }

    const newUser: User = {
      name,
      email,
      password,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      isAuthenticated: true,
      phone: '',
      vehicleType: role === 'rider' ? 'Bicycle' : '',
      plateNumber: role === 'rider' ? 'LAG-442-XP' : '',
      isAvailable: true,
      credentials: role === 'rider' ? DEFAULT_CREDENTIALS : [],
      reviews: role === 'rider' ? DEFAULT_REVIEWS : []
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: (email: string, password: string, rememberMe: boolean): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const user = users.find((u: any) => u.email === email);

    if (user && user.password === password) {
      const sessionUser = { ...user, isAuthenticated: true };
      
      if (sessionUser.role === 'rider') {
        if (!sessionUser.credentials) sessionUser.credentials = DEFAULT_CREDENTIALS;
        if (!sessionUser.reviews) sessionUser.reviews = DEFAULT_REVIEWS;
        if (!sessionUser.plateNumber) sessionUser.plateNumber = 'LAG-442-XP';
      }
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      
      return sessionUser;
    }
    return null;
  },

  getRememberedEmail: (): string => {
    return localStorage.getItem(REMEMBER_KEY) || '';
  },

  updateUser: (userData: Partial<User>) => {
    const session = authService.getCurrentUser();
    if (!session) return;
    
    const updated = { ...session, ...userData };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const updatedUsers = users.map((u: User) => u.email === updated.email ? updated : u);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return !!(user && user.isAuthenticated);
  }
};
