package com.example.MusicStream.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MusicCategoryTest {

    @Test
    void musicCategory_ShouldHaveAllExpectedValues() {
        MusicCategory[] categories = MusicCategory.values();
        
        assertEquals(8, categories.length);
        
        assertTrue(containsCategory(categories, MusicCategory.pop));
        assertTrue(containsCategory(categories, MusicCategory.rock));
        assertTrue(containsCategory(categories, MusicCategory.rap));
        assertTrue(containsCategory(categories, MusicCategory.jazz));
        assertTrue(containsCategory(categories, MusicCategory.classical));
        assertTrue(containsCategory(categories, MusicCategory.electronic));
        assertTrue(containsCategory(categories, MusicCategory.reggae));
        assertTrue(containsCategory(categories, MusicCategory.other));
    }

    @Test
    void musicCategory_ShouldReturnCorrectName() {
        assertEquals("pop", MusicCategory.pop.name());
        assertEquals("rock", MusicCategory.rock.name());
        assertEquals("rap", MusicCategory.rap.name());
        assertEquals("jazz", MusicCategory.jazz.name());
        assertEquals("classical", MusicCategory.classical.name());
        assertEquals("electronic", MusicCategory.electronic.name());
        assertEquals("reggae", MusicCategory.reggae.name());
        assertEquals("other", MusicCategory.other.name());
    }

    @Test
    void musicCategory_ShouldBeEnum() {
        assertTrue(MusicCategory.pop instanceof Enum);
        assertTrue(MusicCategory.rock instanceof Enum);
        assertTrue(MusicCategory.rap instanceof Enum);
        assertTrue(MusicCategory.jazz instanceof Enum);
        assertTrue(MusicCategory.classical instanceof Enum);
        assertTrue(MusicCategory.electronic instanceof Enum);
        assertTrue(MusicCategory.reggae instanceof Enum);
        assertTrue(MusicCategory.other instanceof Enum);
    }

    @Test
    void musicCategory_ShouldValueOfCorrectly() {
        assertEquals(MusicCategory.pop, MusicCategory.valueOf("pop"));
        assertEquals(MusicCategory.rock, MusicCategory.valueOf("rock"));
        assertEquals(MusicCategory.rap, MusicCategory.valueOf("rap"));
        assertEquals(MusicCategory.jazz, MusicCategory.valueOf("jazz"));
        assertEquals(MusicCategory.classical, MusicCategory.valueOf("classical"));
        assertEquals(MusicCategory.electronic, MusicCategory.valueOf("electronic"));
        assertEquals(MusicCategory.reggae, MusicCategory.valueOf("reggae"));
        assertEquals(MusicCategory.other, MusicCategory.valueOf("other"));
    }

    @Test
    void musicCategory_ShouldThrowExceptionForInvalidValue() {
        assertThrows(IllegalArgumentException.class, () -> {
            MusicCategory.valueOf("invalid");
        });
    }

    @Test
    void musicCategory_ShouldHaveCorrectToString() {
        assertEquals("pop", MusicCategory.pop.toString());
        assertEquals("rock", MusicCategory.rock.toString());
        assertEquals("rap", MusicCategory.rap.toString());
        assertEquals("jazz", MusicCategory.jazz.toString());
        assertEquals("classical", MusicCategory.classical.toString());
        assertEquals("electronic", MusicCategory.electronic.toString());
        assertEquals("reggae", MusicCategory.reggae.toString());
        assertEquals("other", MusicCategory.other.toString());
    }

    @Test
    void musicCategory_ShouldHaveCorrectOrdinal() {
        assertEquals(0, MusicCategory.pop.ordinal());
        assertEquals(1, MusicCategory.rock.ordinal());
        assertEquals(2, MusicCategory.rap.ordinal());
        assertEquals(3, MusicCategory.jazz.ordinal());
        assertEquals(4, MusicCategory.classical.ordinal());
        assertEquals(5, MusicCategory.electronic.ordinal());
        assertEquals(6, MusicCategory.reggae.ordinal());
        assertEquals(7, MusicCategory.other.ordinal());
    }

    private boolean containsCategory(MusicCategory[] categories, MusicCategory category) {
        for (MusicCategory c : categories) {
            if (c == category) {
                return true;
            }
        }
        return false;
    }
}
