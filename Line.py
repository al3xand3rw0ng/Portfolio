# Purpose: To represent a line
# Author: Alex Wong

import pygame

from Drawable import Drawable


class Line(Drawable):
    # Constructor
    def __init__(self, x, y, visible):
        super().__init__(x, y, visible)

    def get_rect(self, surface):
        pass

    def draw(self, surface):
        location = self.get_location()
        pygame.draw.line(surface, (0, 0, 0), (0, location[1]), (location[0], location[1]), 1)
