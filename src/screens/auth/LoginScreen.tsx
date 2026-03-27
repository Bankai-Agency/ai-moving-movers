/**
 * AI Moving — Mover App — Login Screen
 *
 * Animated floating blobs background + login form.
 * Background palette derived from Input bg (#EFF2F7).
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Input,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ───────── Animated background (web only) ───────── */

const WebAnimatedBackground = () => {
  if (Platform.OS !== 'web') return null;

  const keyframes = `
    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(20px, 30px) scale(1.06); }
      66% { transform: translate(-10px, 15px) scale(0.97); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-20px, 25px) scale(1.08); }
      66% { transform: translate(12px, -8px) scale(0.95); }
    }
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(25px, -20px) scale(1.04); }
      66% { transform: translate(-15px, 12px) scale(1.06); }
    }
    @keyframes float4 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(18px, -15px) scale(1.05); }
      66% { transform: translate(-8px, 22px) scale(0.96); }
    }
    @keyframes float5 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-22px, 18px) scale(1.03); }
      66% { transform: translate(14px, -12px) scale(1.07); }
    }
  `;

  // Palette based on #EFF2F7 (input bg) — same cool gray-blue family
  const blobs = [
    { size: 280, color: 'rgba(218,225,236,0.50)', left: -60,    top: -40,    anim: 'float1', dur: '9s'  },
    { size: 220, color: 'rgba(203,213,228,0.35)', left: '58%',  top: 60,     anim: 'float2', dur: '11s' },
    { size: 320, color: 'rgba(228,231,236,0.40)', left: 40,     top: '48%',  anim: 'float3', dur: '13s' },
    { size: 200, color: 'rgba(210,218,230,0.45)', left: -30,    top: '70%',  anim: 'float4', dur: '10s' },
    { size: 240, color: 'rgba(220,226,235,0.35)', left: '52%',  top: '35%',  anim: 'float5', dur: '12s' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } as any}>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            backgroundColor: b.color,
            filter: 'blur(50px)',
            animation: `${b.anim} ${b.dur} ease-in-out infinite`,
            willChange: 'transform',
          } as any}
        />
      ))}
    </div>
  );
};

/* ───────── Login Screen ───────── */

interface LoginScreenProps {
  onLogin: (login: string, password: string) => void;
  onForgotPassword: () => void;
}

/* ───────── Eye icons for password toggle ───────── */

const EyeIcon = ({ size = 20, color = '#8E8E93' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <g fill={color}>
      <path d="m12 9.75c-1.2426 0-2.25 1.0074-2.25 2.25s1.0074 2.25 2.25 2.25 2.25-1.0074 2.25-2.25-1.0074-2.25-2.25-2.25z"/>
      <path clipRule="evenodd" d="m12 5.5c-2.61777 0-4.97199 1.05139-6.66838 2.35335-.8493.65184-1.54618 1.37578-2.03513 2.08033-.47963.69112-.79649 1.41782-.79649 2.06632s.31686 1.3752.79649 2.0663c.48895.7046 1.18583 1.4285 2.03513 2.0803 1.69639 1.302 4.05061 2.3534 6.66838 2.3534 2.6178 0 4.972-1.0514 6.6684-2.3534.8493-.6518 1.5462-1.3757 2.0351-2.0803.4796-.6911.7965-1.4178.7965-2.0663s-.3169-1.3752-.7965-2.06632c-.4889-.70455-1.1858-1.42849-2.0351-2.08033-1.6964-1.30196-4.0506-2.35335-6.6684-2.35335zm-3.75 6.5c0-2.07107 1.67893-3.75 3.75-3.75 2.0711 0 3.75 1.67893 3.75 3.75 0 2.0711-1.6789 3.75-3.75 3.75-2.07107 0-3.75-1.6789-3.75-3.75z" fillRule="evenodd"/>
    </g>
  </svg>
);

const EyeOffIcon = ({ size = 20, color = '#8E8E93' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <g fill={color}>
      <path clipRule="evenodd" d="m20.5303 4.53033c.2929-.29289.2929-.76777 0-1.06066s-.7677-.29289-1.0606 0l-16.00003 16.00003c-.29289.2929-.29289.7677 0 1.0606s.76777.2929 1.06066 0l3.03502-3.035c1.31782.6079 2.82655 1.0047 4.43465 1.0047 2.6178 0 4.972-1.0514 6.6684-2.3534.8493-.6518 1.5462-1.3757 2.0351-2.0803.4796-.6911.7965-1.4178.7965-2.0663s-.3169-1.3752-.7965-2.06632c-.4889-.70455-1.1858-1.42849-2.0351-2.08033-.2706-.20768-.558-.40898-.8604-.60066zm-5.4016 5.40163-1.098 1.09794c.1406.2938.2193.6227.2193.9701 0 1.2426-1.0074 2.25-2.25 2.25-.3474 0-.6763-.0787-.9701-.2193l-1.09794 1.098c.59284.3926 1.30374.6213 2.06804.6213 2.0711 0 3.75-1.6789 3.75-3.75 0-.7643-.2287-1.4752-.6213-2.06804z" fillRule="evenodd"/>
      <path d="m12.6692 8.30953c.0838.01509.1703-.00973.2305-.06993l1.9496-1.94953c.1323-.13235.0774-.35726-.1029-.40755-.8674-.24197-1.7893-.38252-2.7464-.38252-2.61777 0-4.97199 1.05139-6.66838 2.35335-.8493.65184-1.54618 1.37578-2.03513 2.08033-.47963.69112-.79649 1.41782-.79649 2.06632s.31686 1.3752.79649 2.0663c.41731.6013.98608 1.2168 1.6718 1.7895.09785.0817.24164.0736.33179-.0165l2.93952-2.9396c.0602-.0602.08502-.1467.06993-.2305-.03911-.2172-.05953-.4408-.05953-.6692 0-2.07107 1.67893-3.75 3.75-3.75.2284 0 .452.02042.6692.05953z"/>
    </g>
  </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value.trim());
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailTouched && text.trim()) {
      setEmailError(isValidEmail(text) ? '' : 'Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email.trim() && !isValidEmail(email)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const isValid = email.trim().length > 0 && password.trim().length > 0 && !emailError && isValidEmail(email);

  const handleLogin = () => {
    if (!isValid) return;
    onLogin(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Clean background — no animated blobs */}

        <StatusBarMock />
        <Navbar />

        {/* Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerBlock}>
            <Text variant="h3" color="#212225" align="center">
              Welcome back
            </Text>
            <Text variant="bodyMd" color={colors.gray[500]} align="center">
              Sign in to manage your moves and stay on schedule
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputsBlock}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError || undefined}
            />

            <View style={styles.spacer} />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                Platform.OS === 'web' ? (
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 } as any}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </div>
                ) : (
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </TouchableOpacity>
                )
              }
            />

            <TouchableOpacity onPress={onForgotPassword} style={styles.forgotContainer}>
              <Text variant="bodySm" color={colors.primary[500]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Button
            title="Sign in"
            variant="primary"
            onPress={handleLogin}
            disabled={!isValid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  container: { flex: 1, backgroundColor: '#FAFBFD' },

  scrollContent: { flex: 1, zIndex: 1 },
  scrollInner: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
  },

  headerBlock: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },

  inputsBlock: {
    width: '100%',
  },

  spacer: { height: 12 },

  forgotContainer: { marginTop: 16, alignSelf: 'flex-end' },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32, zIndex: 1 },
});
