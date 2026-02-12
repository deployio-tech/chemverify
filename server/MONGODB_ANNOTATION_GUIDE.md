# MongoDB with Spring Data - Annotation Guide

## Problem: Using @ElementCollection with MongoDB

You were trying to use JPA annotations (`@ElementCollection`, `@Enumerated`, etc.) with MongoDB, but these annotations are designed for relational databases using Hibernate/JPA, not for MongoDB.

### ❌ WRONG (JPA Approach - for SQL Databases):
```java
import jakarta.persistence.*;

@ElementCollection(fetch = FetchType.EAGER)
@Enumerated(EnumType.STRING)
Set<UserRole> roles = new HashSet<>();
```

### ✅ CORRECT (MongoDB Approach - for MongoDB):
```java
private Set<UserRole> roles = new HashSet<>();
```

---

## Why This Works

### How MongoDB Handles Collections

MongoDB **automatically serializes and stores Java Collections** directly in the document as arrays. When you have a field like `Set<UserRole>`, MongoDB:

1. **Stores** it as an array in the document
2. **Automatically converts** enum values to strings (or their ordinal based on configuration)
3. **Deserializes** it back to a Set when retrieving the document

**Example MongoDB Document:**
```json
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "encrypted_password",
  "roles": ["USER", "DERMATOLOGIST"]
}
```

### Eager vs Lazy Loading in MongoDB

In MongoDB, **all nested data is always fetched** by default because:
- MongoDB stores data as JSON-like documents
- There's no concept of separate collection tables
- All data is in one document

**You don't need `FetchType.EAGER`** for MongoDB collections!

---

## Your Setup Summary

### 1. **UserRole Enum** (Already Correct ✅)
Located at: `src/main/java/com/fyp/server/entity/UserRole.java`
```java
@Getter
public enum UserRole {
    USER("USER"),
    DERMATOLOGIST("DERMATOLOGIST"),
    ADMIN("ADMIN");

    private final String authority;

    UserRole(String authority) {
        this.authority = authority;
    }
}
```

### 2. **User Entity** (Fixed ✅)
Located at: `src/main/java/com/fyp/server/entity/User.java`
```java
@Document(collection = "fyp_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    
    private Set<UserRole> roles = new HashSet<>();
    
    // ... rest of the class
}
```

### 3. **Role-Based Access Control** (Already Configured ✅)
Located at: `src/main/java/com/fyp/server/security/WebSecurityConfig.java`
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/dermatologist/**").hasRole("DERMATOLOGIST")
    .requestMatchers("/api/user/**").hasAnyRole("USER", "DERMATOLOGIST", "ADMIN")
    .anyRequest().authenticated()
)
```

---

## MongoDB Annotations Reference

### Common MongoDB Annotations (from `org.springframework.data.mongodb.core.mapping`)

| Annotation | Purpose | Example |
|-----------|---------|---------|
| `@Document` | Marks class as MongoDB document | `@Document(collection = "users")` |
| `@Id` | Marks field as MongoDB _id | `@Id private String id;` |
| `@Field` | Custom field name in MongoDB | `@Field("user_name") private String name;` |
| `@Transient` | Ignores field in persistence | `@Transient private String temp;` |
| `@DBRef` | Reference to another document | `@DBRef private Organization org;` |

### Collections in MongoDB

| Data Type | MongoDB Storage | Notes |
|-----------|-----------------|-------|
| `Set<Enum>` | Array of strings | No annotation needed |
| `List<Enum>` | Array of strings | No annotation needed |
| `Map<String, Value>` | Embedded object | No annotation needed |
| `List<CustomObj>` | Array of objects | Can use `@DBRef` if needed |

---

## Your Render Configuration

Located at: `src/main/resources/application.properties`
```properties
render.api.base-url=https://fyp-ma3m.onrender.com
```

This is configured in: `src/main/java/com/fyp/server/config/ragWebClient.java`
```java
@Configuration
public class ragWebClient {
    @Value("${render.api.base-url}")
    private String renderBaseUrl;

    @Bean
    public WebClient webClient() {
        return WebClient.builder().baseUrl(renderBaseUrl).build();
    }
}
```

---

## Key Differences: JPA vs MongoDB

| Feature | JPA (SQL) | MongoDB |
|---------|-----------|---------|
| **Collection Annotation** | `@ElementCollection` | Just use `Set/List` |
| **Enum Handling** | `@Enumerated(STRING)` | Automatic (just store enum) |
| **Fetch Strategy** | `FetchType.EAGER/LAZY` | Not needed (all data in document) |
| **Import** | `jakarta.persistence.*` | `org.springframework.data.mongodb.*` |
| **Default Package** | JPA entities | spring-data-mongodb entities |

---

## Usage Example in Your Application

### Creating a New User
```java
User user = User.builder()
    .name("Dr. Sharma")
    .email("sharma@example.com")
    .password(encodedPassword)
    .roles(Set.of(UserRole.DERMATOLOGIST, UserRole.USER))
    .build();

userRepository.save(user); // MongoDB stores roles as ["DERMATOLOGIST", "USER"]
```

### Retrieving and Using Roles
```java
User user = userRepository.findByEmail("sharma@example.com");
Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
// Returns SimpleGrantedAuthority objects for Spring Security
```

---

## Summary

✅ **What You Fixed:**
- Removed JPA annotations (`@ElementCollection`, `@Enumerated`)
- Kept simple `Set<UserRole>` field
- MongoDB handles serialization automatically

✅ **What's Working:**
- Role-based access control in WebSecurityConfig
- Three roles: USER, DERMATOLOGIST, ADMIN
- Render API configuration ready to use

✅ **No Changes Needed:**
- UserRole enum
- WebSecurityConfig (roles-based access)
- Application.properties (render URL)

---

## Next Steps

If you need to add more role-based endpoints, just follow this pattern:
```java
.requestMatchers("/api/your-endpoint/**").hasRole("ROLE_NAME")
```

The roles will automatically work with Spring Security through the `getAuthorities()` method in your User entity!

