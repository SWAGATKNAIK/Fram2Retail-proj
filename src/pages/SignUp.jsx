import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout, ShoppingCart, Landmark, ArrowRight,
  Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User,
} from 'lucide-react';
import { registerAccount, startSession } from '../utils/auth';

const roleOptions = [
  { value: 'farmer', label: 'Farmer', description: 'List harvests, manage bookings, bid on crops, find farmland, check soil data', icon: Sprout },
  { value: 'retailer', label: 'Retailer / Business', description: 'Browse harvests, place bookings, post crop requirements, track orders', icon: ShoppingCart },
  { value: 'landowner', label: 'Landowner', description: 'List properties, review lease applications, manage leases', icon: Landmark },
];

function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // If already signed in, go straight to the dashboard.
  useEffect(() => {
    if (sessionStorage.getItem('demoRole')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // -----------------------------------------------------------------------
  // Validation helpers
  // -----------------------------------------------------------------------

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    const newErrors = {};
    const trimmedEmail = email.trim();

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password && confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // -----------------------------------------------------------------------
  // Submit handler
  // -----------------------------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();
    // Prevent duplicate submissions
    if (isSubmitting) return;
    // Clear stale errors on new attempt
    setErrors({});
    setSuccessMessage('');
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Small delay for UX consistency with the sign-in page
    await new Promise((r) => setTimeout(r, 400));

    const normalizedEmail = email.trim().toLowerCase();

    const result = await registerAccount({
      fullName,
      email: normalizedEmail,
      password,
      role: selectedRole,
    });

    if (!result.success) {
      setErrors({ email: result.error });
      setIsSubmitting(false);
      return;
    }

    // Show brief success message, then navigate
    setSuccessMessage('Account created! Redirecting to your dashboard…');

    setTimeout(() => {
      startSession(result.account);
      navigate('/dashboard');
    }, 800);
  }

  // -----------------------------------------------------------------------
  // Style helpers
  // -----------------------------------------------------------------------

  function getInputClass(name) {
    const hasError = errors[name];
    return `w-full px-4 py-3 border rounded-lg text-base transition-colors ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 focus:border-green-primary focus:ring-green-primary/20'
    }`;
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 no-underline">
            <Sprout className="w-10 h-10 text-green-primary" />
            <span className="text-2xl font-bold text-green-dark">Farm2Retail</span>
          </Link>
          <h1 className="text-3xl font-bold text-green-dark mb-2">Create Account</h1>
          <p className="text-gray-600">Join the marketplace and start trading</p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-4 flex items-center gap-2 bg-green-primary/10 text-green-dark border border-green-primary/30 rounded-lg px-4 py-3 text-sm font-medium" role="status">
            <CheckCircle className="w-5 h-5 text-green-primary shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="John Doe"
                className={`${getInputClass('fullName')} pl-10 pr-4 py-3`}
                disabled={isSubmitting}
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
            </div>
            {errors.fullName && (
              <div id="fullName-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                className={`${getInputClass('email')} pl-10 pr-4 py-3`}
                disabled={isSubmitting}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <div id="email-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••••"
                className={`${getInputClass('password')} pl-10 pr-12 py-3`}
                disabled={isSubmitting}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <div id="password-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="••••••••"
                className={`${getInputClass('confirmPassword')} pl-10 pr-12 py-3`}
                disabled={isSubmitting}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div id="confirmPassword-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">Select Role</legend>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Select your role">
              {roleOptions.map((role) => (
                <label
                  key={role.value}
                  className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === role.value
                      ? 'border-green-primary bg-green-primary/5'
                      : 'border-gray-200 hover:border-green-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={() => setSelectedRole(role.value)}
                    className="sr-only"
                    aria-label={role.label}
                  />
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                      selectedRole === role.value
                        ? 'bg-green-primary/10'
                        : 'bg-gray-100'
                    }`}>
                      <role.icon className={`w-6 h-6 ${
                        selectedRole === role.value
                          ? 'text-green-primary'
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <p className={`text-sm font-medium ${
                      selectedRole === role.value
                        ? 'text-green-dark'
                        : 'text-gray-700'
                    }`}>{role.label}</p>
                    <p className={`text-xs mt-1 ${
                      selectedRole === role.value
                        ? 'text-green-primary'
                        : 'text-gray-500'
                    }`}>{role.description}</p>
                  </div>
                  {selectedRole === role.value && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-primary" />
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-primary text-white py-3.5 rounded-lg text-base font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Link to Sign In */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-green-primary hover:text-green-dark no-underline"
            >
              Sign in
            </Link>
          </div>

          {/* Back to Homepage */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-green-primary font-medium no-underline"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
